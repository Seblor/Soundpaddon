export type SOUND_SOURCES = 'myinstants' | 'freesound' | 'voicy' | 'webpage' | 'uwupad'

export type FetchedSound = {
  source: SOUND_SOURCES,
  name: string,
  url: string,
}
