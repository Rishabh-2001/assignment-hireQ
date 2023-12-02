import React, { useState } from "react";
import { Button, Modal, message } from "antd";
import { useDispatch } from "react-redux";
import { deleteUser } from "../slices/users.slice";
const DeleteModal = ({
  on,
  setOn,
  deleteContent,
  setDeleteContent,
  setSelectedUsers,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    dispatch(deleteUser(deleteContent));
    message.success("User Deleted Successfully");
    setDeleteContent([]);
    setSelectedUsers([]);

    setOn(false);
  };
  const handleCancel = () => {
    setOn(false);
  };
  return (
    <>
      <Modal
        title="Delete Modal"
        open={on}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Go Back
          </Button>,
          <Button
            key="submit"
            className="text-white bg-blue-600"
            onClick={handleOk}
          >
            Delete
          </Button>,
        ]}
      >
        <span>
          Are You Sure You want to delete{" "}
          {deleteContent?.length === 1 ? "" : "selected"} user(s):{" "}
          <span className="font-medium">
            {deleteContent?.length === 1 ? deleteContent[0]?.name : ""} ?
          </span>
        </span>
      </Modal>
    </>
  );
};
export default DeleteModal;
