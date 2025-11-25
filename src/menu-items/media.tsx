// third-party
import { FormattedMessage } from 'react-intl';

// assets
import PlayCircleOutlined from '@ant-design/icons/PlayCircleOutlined';
import HomeOutlined from '@ant-design/icons/HomeOutlined';
import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';
import SwapOutlined from '@ant-design/icons/SwapOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined'; // 👈 add a user icon

// type
import { NavItemType } from 'types/menu';

// icons
const icons = { PlayCircleOutlined, HomeOutlined, AppstoreOutlined, SwapOutlined, UserOutlined };

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
    },
    {
      id: 'add-media',
      title: <FormattedMessage id="add-media" />,
      type: 'item',
      url: '/add-media',
      icon: icons.PlusCircleOutlined
    },
    {
      id: 'compare',
      title: <FormattedMessage id="compare" />,
      type: 'item',
      url: '/compare',
      icon: icons.SwapOutlined
    },

    // =========================
    // ⭐ NEW ACCOUNT SETTINGS MENU ITEM
    // =========================
    {
      id: 'account-settings',
      title: <FormattedMessage id="account-settings" />,
      type: 'item',
      url: '/account',
      icon: icons.UserOutlined
    }
  ]
};

export default media;
