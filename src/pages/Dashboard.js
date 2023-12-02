import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Col,
  Dropdown,
  Empty,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  message,
} from "antd";
import admin from "../assets/adminicon.png";
import users from "../assets/usericon.png";
import removedUser from "../assets/remove-user.png";
import TableComponent from "../components/Table";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getAllUsers } from "../slices/users.slice";
import { logDOM } from "@testing-library/react";
import DeleteModal from "../components/DeleteModal";

const { Title } = Typography;

const Dashboard = () => {
  const [searchKey, setSearchKey] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [filteredData, setFilteredData] = useState();
  const [on, setOn] = useState(false);
  const [deleteContent, setDeleteContent] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const { data, isLoading, error } = useSelector(
    (store) => store?.users?.usersData
  );
  if (error) {
    message.error(error);
  }
  const { deletedUsers } = useSelector((store) => store?.users);

  const dispatch = useDispatch();

  async function getFilteredData(data, status, type, searchKey) {
    if (status === "INACTIVE") {
      setFilteredData(deletedUsers);
      return;
    }
    // Filtering data based on status and type
    const filteredData =
      data && data?.length > 0
        ? data.filter((item) => {
            return (
              (type === "" || item?.role === type) &&
              (item?.name.toLowerCase().includes(searchKey.toLowerCase()) ||
                item?.email.toLowerCase().includes(searchKey.toLowerCase()))
            );
          })
        : [];

    // Setting the filtered data to state
    setFilteredData(filteredData);
  }

 
  // this is for handling filtering at client level
  useEffect(() => {
    getFilteredData(data, status, type, searchKey);
  }, [data, status, type, searchKey]);

  // getting all users
  useEffect(() => {
    dispatch(getAllUsers());
  }, []);
  // for handling pagination, and filtering from server side, include page, and limit,
  //and filtering params in use effect dependency array

  // when table is empty
  const locale = {
    emptyText: isLoading ? (
      <Spin tip="Loading" size="large" />
    ) : (
      <Empty
        className="flex flex-col items-center justify-center p-10"
        // image={EmptyImage}
        imageStyle={{ height: 250 }}
        description={
          <div className="flex w-80 flex-col gap-4">
            <Typography.Text className="text-lg text-black">
              No Users to show.
            </Typography.Text>
          </div>
        }
      />
    ),
  };

  // count of admins
  function getAdminAcount() {
    let cnt = 0;
    for (let i = 0; i < data?.length; i++) {
      if (data[i]?.role === "admin") {
        cnt++;
      }
    }
    return cnt;
  }
  function handleDeleteAll() {}
  const mapdata = isLoading
    ? []
    : filteredData &&
      filteredData.map((d, idx) => ({
        key: idx,
        id: d?.id || idx,
        name: d?.name || "",
        email: d?.email || "NA",
        role: d?.role || "",
        status: d?.status || "",
      }));

  return (
    <div>
      {/* CARD CONTAINER  */}
      <div className="flex gap-4 lg:flex-row md:flex-row sm:flex-col">
        <Card value={data?.length} icon={users} title={"Total Users"} />
        <Card value={getAdminAcount()} icon={admin} title={"Total Admin"} />
        <Card
          value={deletedUsers?.length}
          icon={removedUser}
          title={"Removed Users"}
        />
      </div>

      <div className=" bg-white py-3 ">
        <Title level={4}>Users</Title>

        <div className="flex flex-col justify-between gap-2 pb-4 md:flex-row">
          <div className="flex flex-col gap-2">
            <Typography.Text>Search :</Typography.Text>
            <Input.Search
              className="md:w-[440px]"
              placeholder="Search By Name or email"
              onChange={(e) => setSearchKey(e.target.value)}
              allowClear
            />
          </div>
          <div className="flex w-full flex-col gap-2">
            <Typography.Text>User Type:</Typography.Text>
            <Select
              defaultValue="All"
              onChange={(value) => setType(value)}
              options={[
                { value: "", label: "All" },
                { value: "admin", label: "Admin" },
                { value: "member", label: "Member" },
              ]}
            />
          </div>
          <div className="flex w-full flex-col gap-2">
            <Typography.Text>User Status:</Typography.Text>
            <Select
              defaultValue="All"
              onChange={(value) => setStatus(value)}
              options={[
                { value: "", label: "All" },
                { value: "ACTIVE", label: "Active" },
                { value: "INACTIVE", label: "Inactive" },
              ]}
            />
          </div>
        </div>

        <TableComponent
          page={page}
          limit={limit}
          setPage={setPage}
          setLimit={setLimit}
          data={mapdata}
          locale={locale}
          isLoading={isLoading}
          setOn={setOn}
          setDeleteContent={setDeleteContent}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
        />
      </div>
      <DeleteModal
        on={on}
        setOn={setOn}
        deleteContent={deleteContent}
        setDeleteContent={setDeleteContent}
        setSelectedUsers={setSelectedUsers}
      />
    </div>
  );
};

export default Dashboard;
