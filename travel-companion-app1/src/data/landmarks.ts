export interface Landmark {
  id: string;
  name: string;
  description_en: string;
  description_ru: string;
  latitude: number;
  longitude: number;
}

export const landmarks: Landmark[] = [
  {
    id: '1',
    name: 'Mamayev Kurgan',
    description_en:
      'Mamayev Kurgan is a dominant height overlooking the city of Volgograd. It is best known as the site of the memorial complex commemorating the Battle of Stalingrad, one of the most decisive battles of World War II.',
    description_ru:
      'Мамаев курган — возвышенность в центре Волгограда. Здесь расположен мемориальный комплекс, посвящённый Сталинградской битве, одному из самых решающих сражений Второй мировой войны.',
    latitude: 48.7426,
    longitude: 44.5376
  },
  {
    id: '2',
    name: 'The Motherland Calls',
    description_en:
      'The Motherland Calls is a colossal statue in Volgograd, created to commemorate the heroes of the Battle of Stalingrad. It was once the tallest statue in the world and remains a powerful national symbol.',
    description_ru:
      '«Родина-мать зовёт!» — монументальная скульптура в Волгограде, созданная в память о героях Сталинградской битвы. Является одним из самых узнаваемых символов России.',
    latitude: 48.7428,
    longitude: 44.5369
  }
];
