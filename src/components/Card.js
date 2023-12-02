import React from "react"
import { Typography } from "antd"

function Card({ value, icon, headingvalue, title }) {
  return (
    <div className="mb-2 h-24 w-72 rounded-sm border bg-white p-4 shadow-md flex flex-[1] sm:w-full">
      <div className="flex flex-col gap-2 ">
        <div className="flex items-center gap-3 ">
          <img className="h-6 w-6 rounded-md " src={icon} alt="icon" />
          <Typography.Text level={6}>{title}</Typography.Text>
        </div>
        <div className="mt-2 flex ">
          <Typography.Title className="m-0 p-0" level={3}>
            {value}
          </Typography.Title>
        </div>
      </div>
    </div>
  )
}

export default Card
