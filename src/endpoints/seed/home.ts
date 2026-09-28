import type { Form, HomePage, Media } from '@/payload-types'

type HomePageArgs = {
  backgroundImage: Media
  circleImage: Media
  roundedImage: Media
  stepImages: [Media, Media, Media]
  impactImages: [Media, Media, Media, Media]
  infoStripImage: Media
  contactForm: Form
}

export const homePageGlobal: (args: HomePageArgs) => Partial<HomePage> = ({
  backgroundImage,
  circleImage,
  roundedImage,
  stepImages,
  impactImages,
  infoStripImage,
  contactForm,
}) => {
  return {
    badgeText: 'EU Organic Certified Vermicompost',
    headingLine1: 'Healthy Soil.',
    headingAccent: 'Healthy Harvest.',
    subtext:
      'We transform organic matter into nutrient-rich vermicompost that rebuilds soil health, boosts crop productivity and nurtures a greener tomorrow.',
    backgroundImage: backgroundImage.id,
    circleImage: circleImage.id,
    roundedImage: roundedImage.id,

    processHeading: 'Our 3-Step Natural Process',
    processSteps: [
      {
        image: stepImages[0].id,
        title: 'Organic Matter In',
        description: 'We source quality organic waste from farms, markets and food processing units.',
      },
      {
        image: stepImages[1].id,
        title: 'Earthworm Magic',
        description:
          'Our earthworms break it down naturally, enriching it with beneficial microbes and nutrients.',
      },
      {
        image: stepImages[2].id,
        title: 'Nutrient-Rich Vermicompost',
        description:
          'A natural, odour-free and nutrient-dense solution for healthy soil and abundant harvests.',
      },
    ],

    productsHeading: 'Our Products',
    productsLimit: 3,

    whyChooseHeading: 'Why Choose Happy Farmers?',
    whyChooseNote: 'Certified closed-loop vermicomposting regeneration.',
    whyChooseItems: [
      { icon: 'leaf', text: '100% Natural & Chemical-Free' },
      { icon: 'droplets', text: 'Enhances Soil Fertility' },
      { icon: 'trendingUp', text: 'Increases Crop Yield' },
      { icon: 'shieldCheck', text: 'Improves Plant Immunity' },
      { icon: 'globe', text: 'Sustainable & Eco-Friendly' },
    ],

    impactHeading: 'Better Soil. Better Crops. Better Tomorrow.',
    impactItems: [
      {
        image: impactImages[0].id,
        emoji: '🌱',
        title: 'Improves Soil Health',
        description: 'Builds fertile, living soil for the long term.',
      },
      {
        image: impactImages[1].id,
        emoji: '📈',
        title: 'Boosts Productivity',
        description: 'Promotes stronger plants and higher yields.',
      },
      {
        image: impactImages[2].id,
        emoji: '🥗',
        title: 'Enhances Quality',
        description: 'Improves taste, nutrition and shelf life.',
      },
      {
        image: impactImages[3].id,
        emoji: '🌍',
        title: 'Sustainable Future',
        description: 'Supports organic farming and a healthier planet.',
      },
    ],

    certTitle: 'EU Organic Certification',
    certDescription:
      'Our products are certified under the EU Organic Regulation, ensuring the highest standards of quality, safety and sustainability.',
    certNumber: 'IN-ORG-005',

    contactHeading: 'Get in Touch',
    contactSubtext: "Have questions or need bulk orders? We're here to help you grow.",
    contactForm: contactForm.id,
    phone: '+91 98765 43210',
    email: 'info@happyfarmers.in',
    location: 'Karnataka, India',
    workingHours: 'Mon - Sat: 9:00 AM - 6:00 PM',
    infoStripImage: infoStripImage.id,
  }
}
