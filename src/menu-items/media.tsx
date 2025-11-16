// third-party
import { FormattedMessage } from 'react-intl';

// assets
import PlayCircleOutlined from '@ant-design/icons/PlayCircleOutlined';
import HomeOutlined from '@ant-design/icons/HomeOutlined';
import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = { PlayCircleOutlined, HomeOutlined, AppstoreOutlined };

// ==============================|| MENU ITEMS - MEDIA ||============================== //

const media: NavItemType = {
  id: 'group-media',
  title: <FormattedMessage id="media" />,
  type: 'group',
  children: [
    {
      id: 'browse-catalog',
      title: <FormattedMessage id="browse-catalog" />,
      type: 'item',
      url: '/catalog',
      icon: icons.AppstoreOutlined
    }
  ]
};

export default media;
