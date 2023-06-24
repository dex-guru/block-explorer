import { FC, MouseEventHandler, useState } from 'react'
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import Button from '../Button'
import { IconCross, IconMenu } from '@/components'
import styles from './PageMenu.module.scss'

const PageMenu: FC<{
  links: (LinkProps & { caption: string; className?: string })[]
  className?: string
  onOpenChange?: (value: boolean) => void
}> = ({ links, className, onOpenChange }) => {
  const pathname = usePathname()

  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    document.documentElement.classList[isOpen ? 'remove' : 'add']('open-menu')
    onOpenChange && onOpenChange(!isOpen)
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
          const handleLinkCLick: MouseEventHandler<HTMLAnchorElement> = (e) => {
            document.documentElement.classList.remove('open-menu')
            link.onClick && link.onClick(e)
          }

          return (
            <li className={styles.item} key={idx}>
              <Link
                {...link}
                onClick={handleLinkCLick}
                className={clsx(
                  styles.link,
                  {
                    [styles.active]: pathname === link.href,
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
