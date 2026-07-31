import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';

interface Bubble {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
}

@Component({
  selector: 'app-liquid-bubbles',
  standalone: true,
  template: `<canvas #canvas class="liquid-canvas" aria-hidden="true"></canvas>`,
  styles: [
    `
      :host {
        display: block;
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
      }

      .liquid-canvas {
        width: 100%;
        height: 100%;
        display: block;
        mix-blend-mode: soft-light;
        opacity: 0.9;
      }

      :host-context(.dark-mode) .liquid-canvas {
        mix-blend-mode: screen;
        opacity: 0.55;
      }

      @media (prefers-reduced-motion: reduce) {
        :host {
          display: none;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiquidBubblesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  /** Relative strength / count of bubbles */
  @Input() density: 'soft' | 'rich' = 'rich';
  @Input() interactive = true;

  private readonly zone = inject(NgZone);

  private gl?: WebGLRenderingContext;
  private program?: WebGLProgram;
  private raf = 0;
  private bubbles: Bubble[] = [];
  private mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  private start = 0;
  private reduced = false;
  private destroyed = false;

  private onResize = () => this.resize();
  private onMove = (e: PointerEvent) => this.handleMove(e);

  private uTime?: WebGLUniformLocation | null;
  private uRes?: WebGLUniformLocation | null;
  private uMouse?: WebGLUniformLocation | null;
  private uCount?: WebGLUniformLocation | null;
  private uBubbles?: WebGLUniformLocation | null;
  private uSage?: WebGLUniformLocation | null;
  private uGold?: WebGLUniformLocation | null;
  private uIvory?: WebGLUniformLocation | null;

  ngAfterViewInit(): void {
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.reduced) return;

    this.zone.runOutsideAngular(() => {
      const canvas = this.canvasRef.nativeElement;
      const gl = canvas.getContext('webgl', {
        alpha: true,
        antialias: true,
        premultipliedAlpha: true,
      });
      if (!gl) return;

      this.gl = gl;
      if (!this.initProgram(gl)) return;

      this.seedBubbles();
      this.resize();
      this.start = performance.now();

      window.addEventListener('resize', this.onResize, { passive: true });
      if (this.interactive) {
        window.addEventListener('pointermove', this.onMove, { passive: true });
      }

      const tick = (now: number) => {
        if (this.destroyed) return;
        this.render(now);
        this.raf = requestAnimationFrame(tick);
      };
      this.raf = requestAnimationFrame(tick);
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onMove);
    if (this.gl && this.program) {
      this.gl.deleteProgram(this.program);
    }
  }

  private seedBubbles(): void {
    const count = this.density === 'rich' ? 7 : 5;
    this.bubbles = Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        x: 0.5 + Math.cos(angle) * (0.18 + (i % 3) * 0.06),
        y: 0.48 + Math.sin(angle) * (0.16 + (i % 2) * 0.08),
        r: 0.12 + (i % 4) * 0.035,
        vx: (Math.random() - 0.5) * 0.00035,
        vy: (Math.random() - 0.5) * 0.00035,
        phase: Math.random() * Math.PI * 2,
      };
    });
  }

  private handleMove(e: PointerEvent): void {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    this.mouse.tx = (e.clientX - rect.left) / rect.width;
    this.mouse.ty = 1 - (e.clientY - rect.top) / rect.height;
  }

  private resize(): void {
    const canvas = this.canvasRef.nativeElement;
    const gl = this.gl;
    if (!gl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  }

  private initProgram(gl: WebGLRenderingContext): boolean {
    const vs = `
      attribute vec2 a_pos;
      void main() {
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `;

    const fs = `
      precision mediump float;
      uniform vec2 u_res;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform int u_count;
      uniform vec3 u_bubbles[8];
      uniform vec3 u_sage;
      uniform vec3 u_gold;
      uniform vec3 u_ivory;

      float metaball(vec2 p, vec2 c, float r) {
        float d = length(p - c);
        return (r * r) / (d * d + 0.0008);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res;
        float aspect = u_res.x / max(u_res.y, 1.0);
        vec2 p = vec2((uv.x - 0.5) * aspect + 0.5, uv.y);

        float field = 0.0;
        for (int i = 0; i < 8; i++) {
          if (i >= u_count) break;
          vec3 b = u_bubbles[i];
          vec2 c = vec2((b.x - 0.5) * aspect + 0.5, b.y);
          float pulse = 1.0 + 0.045 * sin(u_time * 0.8 + b.z * 6.0);
          field += metaball(p, c, b.z * pulse);
        }

        // Mouse liquid attractor
        vec2 m = vec2((u_mouse.x - 0.5) * aspect + 0.5, u_mouse.y);
        field += metaball(p, m, 0.16 + 0.02 * sin(u_time * 1.4));

        float edge = smoothstep(0.92, 1.35, field);
        float core = smoothstep(1.15, 1.85, field);
        float rim = edge * (1.0 - core);

        // Soft glass highlight
        vec2 light = normalize(vec2(0.35, 0.75));
        float spec = pow(max(0.0, 1.0 - length(p - (m + light * 0.08))), 18.0) * edge;

        vec3 col = mix(u_sage, u_ivory, core);
        col = mix(col, u_gold, rim * 0.55);
        col += u_gold * spec * 0.65;
        col += u_ivory * rim * 0.25;

        float alpha = clamp(edge * 0.55 + core * 0.22, 0.0, 0.72);
        // Fade near borders for soft vignette
        float vig = smoothstep(0.0, 0.18, uv.x) * smoothstep(1.0, 0.82, uv.x)
                  * smoothstep(0.0, 0.16, uv.y) * smoothstep(1.0, 0.84, uv.y);
        alpha *= vig;

        gl_FragColor = vec4(col, alpha);
      }
    `;

    const vert = this.compile(gl, gl.VERTEX_SHADER, vs);
    const frag = this.compile(gl, gl.FRAGMENT_SHADER, fs);
    if (!vert || !frag) return false;

    const program = gl.createProgram();
    if (!program) return false;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return false;
    }

    this.program = program;
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    this.uTime = gl.getUniformLocation(program, 'u_time');
    this.uRes = gl.getUniformLocation(program, 'u_res');
    this.uMouse = gl.getUniformLocation(program, 'u_mouse');
    this.uCount = gl.getUniformLocation(program, 'u_count');
    this.uBubbles = gl.getUniformLocation(program, 'u_bubbles[0]');
    this.uSage = gl.getUniformLocation(program, 'u_sage');
    this.uGold = gl.getUniformLocation(program, 'u_gold');
    this.uIvory = gl.getUniformLocation(program, 'u_ivory');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    return true;
  }

  private compile(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  private render(now: number): void {
    const gl = this.gl;
    const program = this.program;
    if (!gl || !program) return;

    const t = (now - this.start) / 1000;

    // Smooth mouse
    this.mouse.x += (this.mouse.tx - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.ty - this.mouse.y) * 0.06;

    // Drift bubbles slowly + slight attraction to mouse
    for (const b of this.bubbles) {
      b.phase += 0.008;
      b.x += b.vx + Math.sin(t * 0.35 + b.phase) * 0.00015;
      b.y += b.vy + Math.cos(t * 0.28 + b.phase) * 0.00012;

      const dx = this.mouse.x - b.x;
      const dy = this.mouse.y - b.y;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < 0.45) {
        b.x += (dx / dist) * 0.00045;
        b.y += (dy / dist) * 0.00045;
      }

      // Soft bounds
      if (b.x < 0.12 || b.x > 0.88) b.vx *= -1;
      if (b.y < 0.12 || b.y > 0.88) b.vy *= -1;
      b.x = Math.min(0.9, Math.max(0.1, b.x));
      b.y = Math.min(0.9, Math.max(0.1, b.y));
    }

    const data: number[] = [];
    for (let i = 0; i < 8; i++) {
      const b = this.bubbles[i];
      if (b) data.push(b.x, b.y, b.r);
      else data.push(0, 0, 0);
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform1f(this.uTime!, t);
    gl.uniform2f(this.uRes!, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    gl.uniform2f(this.uMouse!, this.mouse.x, this.mouse.y);
    gl.uniform1i(this.uCount!, this.bubbles.length);
    gl.uniform3fv(this.uBubbles!, new Float32Array(data));
    // Sage / champagne / ivory
    gl.uniform3f(this.uSage!, 0.863, 0.91, 0.843);
    gl.uniform3f(this.uGold!, 0.769, 0.647, 0.455);
    gl.uniform3f(this.uIvory!, 0.984, 0.976, 0.957);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
