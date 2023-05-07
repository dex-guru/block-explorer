import { FC, useState } from 'react'
import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import { IconCross, IconMenu } from '..'
import { clsx } from 'clsx'
import Button from '../Button'
import styles from './PageMenu.module.scss'

const PageMenu: FC<{
  links: (LinkProps & { caption: string; className?: string })[]
  className?: string
}> = ({ links, className }) => {
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const Icon = isOpen ? IconCross : IconMenu

  return (
    <div className={clsx(styles.container, className)}>
      <Button
        icon={<Icon className={styles.icon} />}
        className={clsx(styles.toggle, { [styles.toggled]: isOpen })}
        onClick={handleClick}
      />
      <ul className={clsx(styles.list, { [styles.open]: isOpen })}>
        {links.map((link, idx) => {
          return (
            <li className={styles.item} key={idx}>
              <Link
                {...link}
                className={clsx(
                  styles.link,
                  {
                    [styles.active]: router.pathname === link.href,
                  },
                  link.className
                )}
              >
                {link.caption}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default PageMenu
