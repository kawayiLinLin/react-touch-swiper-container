import React from 'react';
import { TouchSwpierContainerProps } from './typings';
import './style.less';
/**
 * @example
 * import TouchSwiperContainer from '@/components/base/touch-swiper-container'
 * const pageList = [
 *  { id: 1, name: '第一页' },
 *  { id: 2, name: '第二页' },
 *  { id: 3, name: '第三页' }
 * ]
 * const Page = props => {
 *  const [current, setCurrent] = useState(1)
 *  const pages = useMemo(() => {
 *   const currentIndex = pageList.findIndex(p => p.id === current)
 *   return [
 *    pageList[currentIndex - 1],
 *    pageList[currentIndex],
 *    pageList[currentIndex + 1]
 *   ].map(item => !item ? null : item)
 *  }, [current])
 *
 *  const handleChange = (next) => setCurrent(next)
 *  return <TouchSwiperContainer onAnimationEnd={handleChange} pages={pages}>
 *   {(item) => <View>{pageList.find(p => p.id === item)?.name}</View>}
 *  </TouchSwiperContainer>
 * }
 */
declare const TouchSwiperContainer: React.FC<TouchSwpierContainerProps>;
export default TouchSwiperContainer;
