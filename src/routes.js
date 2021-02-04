import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";

// Route Views
import Schedules from "./views/Schedules";
import Announcements from "./views/Announcements";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/schedules" />
  },
  {
    path: "/schedules",
    layout: DefaultLayout,
    component: Schedules
  },
  {
    path: "/announcements",
    layout: DefaultLayout,
    component: Announcements
  }
];
