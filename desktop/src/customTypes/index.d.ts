export type SOUND_SOURCES = 'myinstants' | 'freesound' | 'voicy' | 'webpage' | 'uwupad' | 'pixabay';

export type FetchedSound = {
  source: SOUND_SOURCES,
  name: string,
  url: string,
}
