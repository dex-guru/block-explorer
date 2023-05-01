import { DiscussionEmbed } from 'disqus-react'
import { FC } from 'react'
import { CommentsProps } from './types'

const Comments: FC<CommentsProps> = ({ id, title }) => {
  const disqusShortname = 'your-disqus-shortname'
  const disqusConfig = {
    url: 'http://block-explorer-five.vercel.app/',
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
