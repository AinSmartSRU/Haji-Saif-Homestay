export type GalleryImage = {
  src: string;
  alt: string;
  label: string;
};

export const homepageGalleryImages: GalleryImage[] = [
  {
    src: "/nonamanis-luar-1.webp",
    alt: "Bahagian luar unit Nonamanis di Haji Saif Homestay Putatan",
    label: "Luar rumah Nonamanis",
  },
  {
    src: "/nonamanis-ruangtamu-1.webp",
    alt: "Ruang tamu unit Nonamanis di Haji Saif Homestay Putatan",
    label: "Ruang tamu Nonamanis",
  },
  {
    src: "/nonamanis-ruangmakan.webp",
    alt: "Ruang makan unit Nonamanis di Haji Saif Homestay Putatan",
    label: "Ruang makan Nonamanis",
  },
  {
    src: "/serimuka-1.webp",
    alt: "Bahagian luar unit Serimuka di Haji Saif Homestay Putatan",
    label: "Luar rumah Serimuka",
  },
  {
    src: "/serimuka-ruangtamu-1.webp",
    alt: "Ruang tamu unit Serimuka di Haji Saif Homestay Putatan",
    label: "Ruang tamu Serimuka",
  },
  {
    src: "/serimuka-dapur.webp",
    alt: "Dapur unit Serimuka di Haji Saif Homestay Putatan",
    label: "Dapur Serimuka",
  },
];

export const unitImages: Record<string, GalleryImage[]> = {
  nonamanis: [
    {
      src: "/nonamanis-luar-1.webp",
      alt: "Bahagian luar unit Nonamanis di Haji Saif Homestay Putatan",
      label: "Luar rumah Nonamanis",
    },
    {
      src: "/nonamanis-ruangtamu-1.webp",
      alt: "Ruang tamu unit Nonamanis di Haji Saif Homestay Putatan",
      label: "Ruang tamu Nonamanis",
    },
    {
      src: "/nonamanis-ruangtamu-2.webp",
      alt: "Sudut kedua ruang tamu unit Nonamanis di Haji Saif Homestay Putatan",
      label: "Sudut ruang tamu Nonamanis",
    },
    {
      src: "/nonamanis-ruangmakan.webp",
      alt: "Ruang makan unit Nonamanis di Haji Saif Homestay Putatan",
      label: "Ruang makan Nonamanis",
    },
    {
      src: "/nonamanisdapur.webp",
      alt: "Dapur utama unit Nonamanis di Haji Saif Homestay Putatan",
      label: "Dapur Nonamanis",
    },
    {
      src: "/nonamanis-dapur-2.webp",
      alt: "Sudut kedua dapur unit Nonamanis di Haji Saif Homestay Putatan",
      label: "Sudut dapur Nonamanis",
    },
    {
      src: "/nonamanis-masterbedroom-tandas.webp",
      alt: "Bilik utama dan tandas unit Nonamanis di Haji Saif Homestay Putatan",
      label: "Bilik utama Nonamanis",
    },
    {
      src: "/nonamanis-bilik2-3-tandasluar.webp",
      alt: "Bilik kedua dan ketiga serta tandas luar unit Nonamanis di Haji Saif Homestay Putatan",
      label: "Bilik dan tandas Nonamanis",
    },
  ],
  serimuka: [
    {
      src: "/serimuka-1.webp",
      alt: "Bahagian luar unit Serimuka di Haji Saif Homestay Putatan",
      label: "Luar rumah Serimuka",
    },
    {
      src: "/serimuka-ruangtamu-1.webp",
      alt: "Ruang tamu unit Serimuka di Haji Saif Homestay Putatan",
      label: "Ruang tamu Serimuka",
    },
    {
      src: "/serimuka-ruangtamu-2.webp",
      alt: "Sudut kedua ruang tamu unit Serimuka di Haji Saif Homestay Putatan",
      label: "Sudut ruang tamu Serimuka",
    },
    {
      src: "/serimuka-dapur.webp",
      alt: "Dapur unit Serimuka di Haji Saif Homestay Putatan",
      label: "Dapur Serimuka",
    },
    {
      src: "/serimuka-makan-laundry.webp",
      alt: "Ruang makan dan laundry unit Serimuka di Haji Saif Homestay Putatan",
      label: "Ruang makan Serimuka",
    },
    {
      src: "/serimuka-bilik-1.webp",
      alt: "Bilik pertama unit Serimuka di Haji Saif Homestay Putatan",
      label: "Bilik 1 Serimuka",
    },
    {
      src: "/serimuka-bilik-2-3.webp",
      alt: "Bilik kedua dan ketiga unit Serimuka di Haji Saif Homestay Putatan",
      label: "Bilik 2 dan 3 Serimuka",
    },
    {
      src: "/serimuka-tandas-1-2.webp",
      alt: "Tandas unit Serimuka di Haji Saif Homestay Putatan",
      label: "Tandas Serimuka",
    },
  ],
};
