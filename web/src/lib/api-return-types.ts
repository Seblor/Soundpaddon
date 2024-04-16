export type SOUND_SOURCES = 'myinstants' | 'freesound' | 'voicy'

export type FetchedSound = {
  source: SOUND_SOURCES,
  name: string,
  url: string,
}
