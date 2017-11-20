import * as React from "react";

import CurrentVersion from "./current_version";
import MenuBar from "./menu_bar";

const Layout: React.SFC<{}> = (props) => {
  return (
    <div className="wrapper">
      <MenuBar />
      {props.children}
      <CurrentVersion />
    </div>
  );
};

export default Layout;
