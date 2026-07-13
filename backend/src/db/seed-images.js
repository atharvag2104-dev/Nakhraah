const PEXELS = {
  gel: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=600',
  acrylic: 'https://images.pexels.com/photos/7858748/pexels-photo-7858748.jpeg?auto=compress&cs=tinysrgb&w=600',
  extensions: 'https://images.pexels.com/photos/3373737/pexels-photo-3373737.jpeg?auto=compress&cs=tinysrgb&w=600',
  french: 'https://images.pexels.com/photos/3993448/pexels-photo-3993448.jpeg?auto=compress&cs=tinysrgb&w=600',
  bridal: 'https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg?auto=compress&cs=tinysrgb&w=600',
  chrome: 'https://images.pexels.com/photos/3685534/pexels-photo-3685534.jpeg?auto=compress&cs=tinysrgb&w=600',
  catEye: 'https://images.pexels.com/photos/7858749/pexels-photo-7858749.jpeg?auto=compress&cs=tinysrgb&w=600',
  art3d: 'https://images.pexels.com/photos/7858747/pexels-photo-7858747.jpeg?auto=compress&cs=tinysrgb&w=600',
  minimal: 'https://images.pexels.com/photos/3992886/pexels-photo-3992886.jpeg?auto=compress&cs=tinysrgb&w=600',
  luxury: 'https://images.pexels.com/photos/7858746/pexels-photo-7858746.jpeg?auto=compress&cs=tinysrgb&w=600',
  polish: 'https://images.pexels.com/photos/746936/pexels-photo-746936.jpeg?auto=compress&cs=tinysrgb&w=600',
};

const services = [
  { name: 'Gel Nails', slug: 'gel-nails', description: 'Long-lasting gel polish with a mirror-like shine. Chip-resistant finish that keeps your nails flawless for weeks.', price: 1200, duration: 75, category: 'gel', featured: true, image: PEXELS.gel },
  { name: 'Acrylic Nails', slug: 'acrylic-nails', description: 'Durable acrylic extensions sculpted to perfection. Ideal for length, strength, and endless design possibilities.', price: 1500, duration: 90, category: 'acrylic', featured: true, image: PEXELS.acrylic },
  { name: 'Nail Extensions', slug: 'nail-extensions', description: 'Custom-length extensions tailored to your style. From natural elegance to bold statement nails.', price: 1800, duration: 120, category: 'extensions', featured: false, image: PEXELS.extensions },
  { name: 'French Nails', slug: 'french-nails', description: 'Timeless French manicure with crisp white tips and a natural pink base. Classic luxury at its finest.', price: 1000, duration: 60, category: 'french', featured: true, image: PEXELS.french },
  { name: 'Bridal Nails', slug: 'bridal-nails', description: 'Exquisite bridal nail art designed for your special day. Delicate embellishments and romantic finishes.', price: 2500, duration: 150, category: 'bridal', featured: true, image: PEXELS.bridal },
  { name: 'Chrome Nails', slug: 'chrome-nails', description: 'Metallic chrome powder finish for an ultra-luxe, mirror-like effect that catches every light.', price: 1600, duration: 90, category: 'chrome', featured: false, image: PEXELS.chrome },
  { name: 'Cat Eye Nails', slug: 'cat-eye-nails', description: 'Magnetic cat-eye gel creates a mesmerizing shifting shimmer. A hypnotic, galaxy-inspired look.', price: 1400, duration: 80, category: 'cat-eye', featured: false, image: PEXELS.catEye },
  { name: '3D Nail Art', slug: '3d-nail-art', description: 'Dimensional nail art with crystals, charms, and sculpted details. Wearable art for the bold.', price: 2200, duration: 120, category: '3d', featured: false, image: PEXELS.art3d },
  { name: 'Minimal Nail Art', slug: 'minimal-nail-art', description: 'Clean lines and subtle accents for the modern minimalist. Less is more, beautifully executed.', price: 900, duration: 45, category: 'minimal', featured: false, image: PEXELS.minimal },
  { name: 'Luxury Nail Art', slug: 'luxury-nail-art', description: 'Premium bespoke designs with Swarovski crystals, hand-painted details, and couture finishes.', price: 3000, duration: 180, category: 'luxury', featured: true, image: PEXELS.luxury },
];

const gallery = [
  { title: 'Gel Manicure', category: 'minimal', image: PEXELS.gel },
  { title: 'French Tips', category: 'french', image: PEXELS.french },
  { title: 'Bridal Set', category: 'bridal', image: PEXELS.bridal },
  { title: 'Luxury Design', category: 'luxury', image: PEXELS.luxury },
  { title: 'Chrome Mirror', category: 'chrome', image: PEXELS.chrome },
  { title: 'Acrylic Art', category: 'minimal', image: PEXELS.acrylic },
  { title: 'Classic French', category: 'french', image: PEXELS.french },
  { title: 'Cat Eye Gel', category: 'chrome', image: PEXELS.catEye },
  { title: 'Glitter Polish', category: 'glitter', image: PEXELS.polish },
  { title: '3D Embellished', category: 'glitter', image: PEXELS.art3d },
  { title: 'Festive Nails', category: 'festive', image: PEXELS.extensions },
  { title: 'Extension Set', category: 'festive', image: PEXELS.extensions },
];

module.exports = { services, gallery };
