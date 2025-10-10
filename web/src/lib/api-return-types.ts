export type SOUND_SOURCES = 'myinstants' | 'freesound' | 'voicy' | 'uwupad' | 'pixabay' | 'webpage'

export type FetchedSound = {
  source: SOUND_SOURCES,
  name: string,
  url: string,
}
