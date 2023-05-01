import { DiscussionEmbed } from 'disqus-react'
import { FC } from 'react'
import { CommentsProps } from './types'

const Comments: FC<CommentsProps> = ({ id, title }) => {
  const disqusShortname = 'your-disqus-shortname'
  const disqusConfig = {
    url: 'https://calm-spiders-go-93-87-41-190.loca.lt/address',
    identifier: id, //  post id
    title: title, //  post title
  }
  return (
    <div>
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  )
}
export default Comments
