import { DiscussionEmbed } from 'disqus-react'
import { FC } from 'react'
import { CommentsProps } from './types'

const Comments: FC<CommentsProps> = ({ id, title }) => {
  const disqusConfig = {
    url: process.env.disqusURL,
    identifier: id, // rest part of url like 'address/0x...', 'txn/0x...', 'block/123'
    title: title, // title
  }
  return (
    <div>
      <DiscussionEmbed
        shortname={process.env.disqusName || ''}
        config={disqusConfig}
      />
    </div>
  )
}
export default Comments
