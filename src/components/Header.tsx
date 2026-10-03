import { AnimatedNavFramer, type AnimatedNavFramerProps } from '@/components/ui/navigation-menu'

export function Header({ activePage = 'home' }: AnimatedNavFramerProps & {
  name?: string
  status?: string
  email?: string
}) {
  return <AnimatedNavFramer activePage={activePage} />
}
