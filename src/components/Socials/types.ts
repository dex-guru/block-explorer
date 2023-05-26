export enum SocialType {
  telegram = 'telegram',
  twitter = 'twitter',
  youtube = 'youtube',
  discord = 'discord',
  facebook = 'facebook',
  github = 'github',
  gitlab = 'gitlab',
}

export type SocialNetwork = {
  type: SocialType
  url: string
}

export type SocialsProps = {
  className?: string
  socials: SocialNetwork[]
}
