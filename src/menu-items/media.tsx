// third-party
import { FormattedMessage } from 'react-intl';

// assets
import HomeOutlined from '@ant-design/icons/HomeOutlined';
import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = { HomeOutlined, AppstoreOutlined };

// ==============================|| MENU ITEMS - MEDIA ||============================== //

const media: NavItemType = {
  id: 'group-media',
  title: <FormattedMessage id="media" />,
  type: 'group',
  children: [
    {
      id: 'home',
      title: <FormattedMessage id="home" />,
      type: 'item',
      url: '/home',
      icon: icons.HomeOutlined
    },
    {
      id: 'catalog',
      title: <FormattedMessage id="catalog" />,
      type: 'item',
      url: '/catalog',
      icon: icons.AppstoreOutlined
    }
  ]
};

export default media;
