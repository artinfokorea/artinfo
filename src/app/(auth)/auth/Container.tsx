"use client"

import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@/components/material"
import Login from "./components/Login"
import SignUp from "./components/SignUp"

export function Container() {
  return (
    <div className="mx-auto max-w-screen-md py-10 px-6">
      <Tabs value="login">
        <TabsHeader>
          <Tab value="login">로그인</Tab>
          <Tab value="signup">회원가입</Tab>
        </TabsHeader>
        <TabsBody>
          <TabPanel value="login">
            <Login />
          </TabPanel>
          <TabPanel value="signup">
            <SignUp />
          </TabPanel>
        </TabsBody>
      </Tabs>
    </div>
  )
}
