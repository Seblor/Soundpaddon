export type SOUND_SOURCES = 'myinstants' | 'freesound' | 'voicy' | 'uwupad' | 'webpage'

export type FetchedSound = {
  source: SOUND_SOURCES,
  name: string,
  url: string,
}
