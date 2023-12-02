import React, { useEffect, useState } from "react";
import {
  Divider,
  Button,
  Form,
  Radio,
  Space,
  Table,
  Typography,
  Input,
  InputNumber,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DeleteModal from "./DeleteModal";
import { useDispatch } from "react-redux";
import { saveEditedData } from "../slices/users.slice";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const TableComponent = ({
  page,
  limit,
  setPage,
  setLimit,
  data,
  locale,
  isLoading,
  setOn,
  setDeleteContent,
  setSelectedUsers,
  selectedUsers,
}) => {
  const [selectionType, setSelectionType] = useState("checkbox");
  const [form] = Form.useForm();
  const [data2, setData2] = useState(data || []);
  const [editingKey, setEditingKey] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setData2(data);
  }, [data]);

  const isEditing = (record) => record.key === editingKey;
  // edit functionality
  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      email: "",
      role: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  // this function saves the edited row data
  const save = async (key) => {
    // console.log("Coming to save ey", key);

    try {
      const row = await form.validateFields();
      const newData = [...data];
      //   console.log("NEW ATA IS:", newData);
      const index = newData.findIndex((item) => key === item.key);
      //   console.log("GOT ISXX val", index);
      if (index > -1) {
        const item = newData[index];
        // console.log("got changed item is ", item);
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        // console.log("This is the new data", newData);
        // setData2(newData);
        dispatch(saveEditedData(newData));
        setEditingKey("");
      } else {
        newData.push(row);
        // console.log("Else row is ", row, "and new data is ", newData);
        // setData2(newData);
        dispatch(saveEditedData(newData));
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  // this function cancels and brings back from edit mode
  const cancel = () => {
    setEditingKey("");
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (text) => <p className="text-blue-600">{text}</p>,
    },
    {
      title: "Name",
      dataIndex: "name",
      editable: true,
    },
    {
      title: "email",
      dataIndex: "email",
      editable: true,
    },
    {
      title: "role",
      dataIndex: "role",
      editable: true,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return (
          <div className="flex gap-4">
            <Space size="middle">
              {record?.status === "INACTIVE" ? (
                <span>Deleted</span>
              ) : (
                <span
                  className="hover:text-red-600 cursor-pointer"
                  onClick={() => handleDelete(record)}
                >
                  {" "}
                  <DeleteOutlined /> Delete
                </span>
              )}
            </Space>

            {editable ? (
              <span>
                <Typography.Link
                  onClick={() => save(record.key)}
                  style={{
                    marginRight: 8,
                  }}
                >
                  Save
                </Typography.Link>
                <Popconfirm
                  title="Sure to cancel?"
                  onConfirm={cancel}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ style: { backgroundColor: "blue" } }} // Set your desired color
                >
                  <a>Cancel</a>
                </Popconfirm>
              </span>
            ) : record?.status === "INACTIVE" ? null : (
              <span
                className="hover:text-blue-600 cursor-pointer"
                disabled={editingKey !== ""}
                onClick={() => edit(record)}
              >
                {" "}
                <EditOutlined /> Edit
              </span>
            )}
          </div>
        );
      },
    },
  ];

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedUsers(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  function handleDelete(record) {
    setOn(true);
    // setDeleteContent(record);
    setDeleteContent((prev) => [...prev, record]);
  }
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div>
      {selectedUsers?.length > 0 ? (
        <Button
          className="bg-red-500 text-white flex justify-end float-right mb-2 "
          onClick={() => {
            setOn(true);
            setDeleteContent(selectedUsers);
          }}
        >
          Delete Selected
        </Button>
      ) : null}
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          columns={mergedColumns}
          dataSource={data2}
          rowClassName="editable-row"
          locale={locale}
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: limit,
            total: data?.length,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
            onChange: (page, newPageSize) => {
              setPage(page);
              setLimit(newPageSize);
            },
          }}
        />
      </Form>
    </div>
  );
};
export default TableComponent;
