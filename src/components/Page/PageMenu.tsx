import { FC, useState } from 'react'
import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import { clsx } from 'clsx'
import Button from '../Button'
import { IconCross, IconMenu } from '@/components'
import styles from './PageMenu.module.scss'

export type PageMenuLink = LinkProps & { caption: string; className?: string }
export type PageMenuLinks = (PageMenuLink & { submenu?: PageMenuLink[] })[]

const PageMenu: FC<{
  links: PageMenuLinks
  className?: string
  onOpenChange?: (value: boolean) => void
}> = ({ links, className, onOpenChange }) => {
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    document.documentElement.classList[isOpen ? 'remove' : 'add']('open-menu')
    onOpenChange && onOpenChange(!isOpen)
    setIsOpen(!isOpen)
  }

  const Icon = isOpen ? IconCross : IconMenu

  const handleLinkCLick = () => {
    document.documentElement.classList.remove('open-menu')
  }

  const renderLink = (link: PageMenuLink, className?: string) => (
    <Link
      {...link}
      href={link.href || '#'}
      onClick={(e) => {
        handleLinkCLick()
        link.onClick && link.onClick(e)
        if (!link.href) {
          e.preventDefault()
        }
      }}
      className={clsx(
        styles.link,
        {
          [styles.active]: router.pathname === link.href,
        },
        link.className,
        className
      )}
    >
      {link.caption}
    </Link>
  )

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
              {renderLink(link)}
              {!!link.submenu?.length && (
                <div className={styles.submenu}>
                  <ul className={styles.submenuList}>
                    {link.submenu.map((submenuLink, submenuIdx) => {
                      return (
                        <li className={styles.submenuItem} key={submenuIdx}>
                          {renderLink(submenuLink, styles.submenuLink)}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default PageMenu
