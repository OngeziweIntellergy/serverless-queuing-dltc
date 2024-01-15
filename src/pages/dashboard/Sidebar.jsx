import React from 'react';
import {
  BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, 
  BsPeopleFill, BsListCheck, BsMenuButtonWideFill, BsFillGearFill
} from 'react-icons/bs';

function Sidebar({ openSidebarToggle, setOpenSidebarToggle }) {

  // This function toggles the sidebar open and close
  const toggleSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle); // Assuming you have a state updater function like this
  };

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <BsCart3 className='icon_header'/> SHOP
            </div>
            {/* Added toggleSidebar function to the onClick event */}
            <span className='icon close_icon' onClick={toggleSidebar}>X</span>
        </div>

        <ul className='sidebar-list'>
            {/* Rest of your sidebar items */}
        </ul>
    </aside>
  );
}

export default Sidebar;
