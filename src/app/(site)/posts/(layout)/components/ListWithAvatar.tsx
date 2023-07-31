"use client"

import {
  Avatar,
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@/components/material"

export default function ListWithAvatar() {
  return (
    <Card className="">
      <div className="px-4 pt-4">
        <h5 className="font-bold">주간 인기 TOP 10</h5>
        <div className="text-sm">
          지난주 커리어리에서 인기 있던 게시물이에요!
        </div>
      </div>
      <List>
        <ListItem>
          <ListItemPrefix>
            <Avatar
              variant="circular"
              alt="candice"
              src="https://www.material-tailwind.com/img/face-1.jpg"
            />
          </ListItemPrefix>
          <div>
            <Typography variant="h6" color="blue-gray">
              Tania Andrew
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
              Software Engineer @ Material Tailwind
            </Typography>
          </div>
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <Avatar
              variant="circular"
              alt="alexander"
              src="https://www.material-tailwind.com/img/face-2.jpg"
            />
          </ListItemPrefix>
          <div>
            <Typography variant="h6" color="blue-gray">
              Alexander
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
              Backend Developer @ Material Tailwind
            </Typography>
          </div>
        </ListItem>
        <ListItem>
          <ListItemPrefix>
            <Avatar
              variant="circular"
              alt="emma"
              src="https://www.material-tailwind.com/img/face-3.jpg"
            />
          </ListItemPrefix>
          <div>
            <Typography variant="h6" color="blue-gray">
              Emma Willever
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
              UI/UX Designer @ Material Tailwind
            </Typography>
          </div>
        </ListItem>
      </List>
    </Card>
  )
}
