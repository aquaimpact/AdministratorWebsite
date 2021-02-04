import React from "react";
import { BrowserRouter as Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";

import Schedules from "./views/Schedules";
import Announcements from "./views/Announcements";

export default () => (
  <>
    <div>
      <Route exact path={`/`} render={ (routerProps) => < Schedules/>} />
      <Route exact path={`/schedules`} render={ (routerProps) => < Schedules/>} />
      <Route exact path={`/announcements`} render={ (routerProps) => < Announcements/>} />
    </div>
  </>
);
