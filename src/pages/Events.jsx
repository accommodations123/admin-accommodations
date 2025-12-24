import React, { useEffect, useState } from "react";
import {
  Card,
  Tag,
  Button,
  Modal,
  Input,
  message,
  Image,
  Row,
  Col,
  Space,
  Typography,
  Empty,
  Tooltip,
  Badge,
  Select,
  DatePicker,
  Descriptions,
  Statistic,
  Divider,
  Alert,
  Spin,
  Avatar,
  Timeline,
  Tabs
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  FilterOutlined,
  CalendarOutlined,
  SearchOutlined,
  FileImageOutlined,
  TeamOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  SettingOutlined
} from "@ant-design/icons";
import moment from "moment";

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const API_BASE = "https://accomodation.api.test.nextkinlife.live";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [viewEvent, setViewEvent] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState(null);
  const [imageError, setImageError] = useState({});
  const [activeView, setActiveView] = useState("grid"); // grid or list

  const fetchEvents = async () => {
    setLoading(true);
    const token = localStorage.getItem("admin-auth");
    if (!token) {
      message.error("Token missing – Login again");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/events/admin/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!data.success) {
        message.error("Failed to load events!");
        setEvents([]);
        return;
      }
      setEvents(Array.isArray(data.events) ? data.events : []);
    } catch (err) {
      console.log(err);
      message.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = [...events];

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchText.toLowerCase()) ||
        event.type.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by event type
    if (eventTypeFilter !== "all") {
      filtered = filtered.filter(event => event.type === eventTypeFilter);
    }

    // Filter by date range
    if (dateRange && dateRange.length === 2) {
      filtered = filtered.filter(event => {
        const eventStartDate = moment(event.start_date);
        return eventStartDate.isBetween(dateRange[0], dateRange[1], 'day', '[]');
      });
    }

    setFilteredEvents(filtered);
  }, [events, statusFilter, searchText, eventTypeFilter, dateRange]);

  const handleApprove = async (id) => {
    const token = localStorage.getItem("admin-auth");
    if (!token) return message.error("Token missing – Login again");

    try {
      await fetch(`${API_BASE}/events/admin/approve/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      message.success("Event approved!");
      fetchEvents();
    } catch (err) {
      message.error("Approve failed!");
    }
  };

  const handleReject = (id) => {
    setCurrentEventId(id);
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    if (!rejectionReason.trim()) return message.error("Enter rejection reason!");
    const token = localStorage.getItem("admin-auth");
    if (!token) return message.error("Token missing – Login again");

    try {
      await fetch(`${API_BASE}/events/admin/reject/${currentEventId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rejection_reason: rejectionReason }),
      });
      message.success("Event rejected!");
      setIsModalVisible(false);
      setRejectionReason("");
      fetchEvents();
    } catch (err) {
      message.error("Reject failed!");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setRejectionReason("");
  };

  const handleView = (event) => {
    setViewEvent(event);
    setViewModalVisible(true);
  };

  const handleViewCancel = () => {
    setViewEvent(null);
    setViewModalVisible(false);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this event?',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        const token = localStorage.getItem("admin-auth");
        if (!token) return message.error("Token missing – Login again");

        try {
          await fetch(`${API_BASE}/events/admin/delete/${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          message.success("Event deleted successfully!");
          fetchEvents();
        } catch (err) {
          message.error("Failed to delete event!");
        }
      },
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      approved: "#52c41a",
      pending: "#faad14",
      rejected: "#f5222d"
    };
    return colors[status] || "#d9d9d9";
  };

  const getStatusBgColor = (status) => {
    const colors = {
      approved: "#f6ffed",
      pending: "#fffbe6",
      rejected: "#fff2f0"
    };
    return colors[status] || "#f5f5f5";
  };

  const handleImageError = (imageId) => {
    setImageError(prev => ({ ...prev, [imageId]: true }));
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // Check if the path already includes the API_BASE
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // Remove any leading slashes to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${API_BASE}/${cleanPath}`;
  };

  const getStatusCount = (status) => {
    if (status === "all") return events.length;
    return events.filter(event => event.status === status).length;
  };

  // Event Card Component
  const EventCard = ({ event }) => {
    const bannerUrl = getImageUrl(event.banner_image);
    const hasBannerError = imageError[`banner-${event._id}`];

    return (
      <Card
        hoverable
        className="event-card"
        style={{
          height: '100%',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease',
          marginBottom: '0'
        }}
        bodyStyle={{ padding: '16px' }}
        cover={
          <div className="relative" style={{ height: '180px', position: 'relative' }}>
            {bannerUrl && !hasBannerError ? (
              <Image
                src={bannerUrl}
                alt={event.title}
                height={180}
                style={{ objectFit: "cover", width: '100%' }}
                preview={false}
                onError={() => handleImageError(`banner-${event._id}`)}
              />
            ) : (
              <div className="h-full bg-gray-100 flex flex-col items-center justify-center" style={{ backgroundColor: '#fafafa' }}>
                <FileImageOutlined style={{ fontSize: '32px', color: '#bfbfbf' }} />
                <span className="text-gray-400 mt-2 text-xs">No Image</span>
              </div>
            )}
            <div
              className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: getStatusBgColor(event.status),
                color: getStatusColor(event.status),
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {event.status?.toUpperCase()}
            </div>
          </div>
        }
        actions={[
          <Tooltip title="View Details">
            <EyeOutlined key="view" onClick={() => handleView(event)} />
          </Tooltip>,
          ...(event.status === "pending" ? [
            <Tooltip title="Approve">
              <CheckOutlined key="approve" onClick={() => handleApprove(event._id)} style={{ color: '#52c41a' }} />
            </Tooltip>,
            <Tooltip title="Reject">
              <CloseOutlined key="reject" onClick={() => handleReject(event._id)} style={{ color: '#f5222d' }} />
            </Tooltip>
          ] : [])
        ]}
      >
        <Card.Meta
          title={
            <div style={{ fontSize: '16px', fontWeight: '600', lineHeight: '1.4' }}>
              {event.title}
            </div>
          }
          description={
            <div>
              <div className="mb-3">
                <Tag color="blue" style={{ borderRadius: '6px', fontSize: '12px', padding: '2px 8px' }}>
                  {event.type?.toUpperCase()}
                </Tag>
                <span className="text-xs text-gray-500 ml-2">
                  {moment(event.start_date).format('MMM DD, YYYY')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <Text strong style={{ color: '#1890ff', fontSize: '15px' }}>${event.price || 0}</Text>
                <Text type="secondary" style={{ fontSize: '13px' }}>
                  <TeamOutlined /> {Array.isArray(event.members_going) ? event.members_going.length : 0}
                </Text>
              </div>
            </div>
          }
        />
      </Card>
    );
  };

  // Event List Item Component
  const EventListItem = ({ event }) => {
    const bannerUrl = getImageUrl(event.banner_image);
    const hasBannerError = imageError[`banner-${event._id}`];

    return (
      <Card
        className="event-list-item"
        style={{
          marginBottom: '16px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease'
        }}
        bodyStyle={{ padding: '20px' }}
      >
        <Row gutter={16} align="middle">
          <Col span={4}>
            {bannerUrl && !hasBannerError ? (
              <Image
                src={bannerUrl}
                alt={event.title}
                height={100}
                width={140}
                style={{ objectFit: "cover", borderRadius: '8px' }}
                preview={false}
                onError={() => handleImageError(`banner-${event._id}`)}
              />
            ) : (
              <div
                className="bg-gray-100 flex flex-col items-center justify-center"
                style={{ height: '100px', width: '140px', borderRadius: '8px', backgroundColor: '#fafafa' }}
              >
                <FileImageOutlined style={{ fontSize: '24px', color: '#bfbfbf' }} />
              </div>
            )}
          </Col>
          <Col span={14}>
            <div className="flex items-center mb-3">
              <Title level={4} style={{ margin: 0, marginRight: '12px', fontSize: '18px' }}>{event.title}</Title>
              <Tag
                color="blue"
                style={{ borderRadius: '6px', marginRight: '8px', fontSize: '12px', padding: '2px 8px' }}
              >
                {event.type?.toUpperCase()}
              </Tag>
              <Tag
                style={{
                  borderRadius: '6px',
                  backgroundColor: getStatusBgColor(event.status),
                  color: getStatusColor(event.status),
                  border: 'none',
                  fontSize: '12px',
                  padding: '2px 8px'
                }}
              >
                {event.status?.toUpperCase()}
              </Tag>
            </div>
            <div className="text-sm text-gray-500 mb-3" style={{ fontSize: '14px' }}>
              <CalendarOutlined /> {moment(event.start_date).format('MMMM DD, YYYY')} - {moment(event.end_date).format('MMMM DD, YYYY')}
            </div>
            <div className="flex items-center">
              <Text strong style={{ color: '#1890ff', marginRight: '16px', fontSize: '16px' }}>${event.price || 0}</Text>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                <TeamOutlined /> {Array.isArray(event.members_going) ? event.members_going.length : 0} going
              </Text>
            </div>
          </Col>
          <Col span={6}>
            <div className="flex flex-col items-end">
              <Space size="middle">
                <Tooltip title="View Details">
                  <Button icon={<EyeOutlined />} onClick={() => handleView(event)} style={{ borderRadius: '8px' }} />
                </Tooltip>
                {event.status === "pending" && (
                  <>
                    <Tooltip title="Approve">
                      <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={() => handleApprove(event._id)}
                        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', borderRadius: '8px' }}
                      />
                    </Tooltip>
                    <Tooltip title="Reject">
                      <Button
                        danger
                        icon={<CloseOutlined />}
                        onClick={() => handleReject(event._id)}
                        style={{ borderRadius: '8px' }}
                      />
                    </Tooltip>
                  </>
                )}
                <Tooltip title="Delete">
                  <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(event._id)} style={{ borderRadius: '8px' }} />
                </Tooltip>
              </Space>
            </div>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#f0f2f5',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '24px 32px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
        }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ margin: 0, color: '#262626', marginBottom: '8px' }}>Events Management</Title>
              <Text type="secondary" style={{ fontSize: '15px' }}>Manage and review community events</Text>
            </Col>
            <Col>
              <Space size="middle">
                <Button
                  type={activeView === "grid" ? "primary" : "default"}
                  icon={<FileImageOutlined />}
                  onClick={() => setActiveView("grid")}
                  style={{ borderRadius: '8px' }}
                >
                  Grid View
                </Button>
                <Button
                  type={activeView === "list" ? "primary" : "default"}
                  icon={<InfoCircleOutlined />}
                  onClick={() => setActiveView("list")}
                  style={{ borderRadius: '8px' }}
                >
                  List View
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                border: 'none',
                overflow: 'hidden'
              }}
              bodyStyle={{ padding: '20px' }}
            >
              <Statistic
                title="Total Events"
                value={events.length}
                prefix={<CalendarOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff', fontSize: '28px', fontWeight: '600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                border: 'none',
                overflow: 'hidden'
              }}
              bodyStyle={{ padding: '20px' }}
            >
              <Statistic
                title="Pending"
                value={getStatusCount("pending")}
                prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14', fontSize: '28px', fontWeight: '600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                border: 'none',
                overflow: 'hidden'
              }}
              bodyStyle={{ padding: '20px' }}
            >
              <Statistic
                title="Approved"
                value={getStatusCount("approved")}
                prefix={<CheckOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: '600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card
              style={{
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                border: 'none',
                overflow: 'hidden'
              }}
              bodyStyle={{ padding: '20px' }}
            >
              <Statistic
                title="Rejected"
                value={getStatusCount("rejected")}
                prefix={<CloseOutlined style={{ color: '#f5222d' }} />}
                valueStyle={{ color: '#f5222d', fontSize: '28px', fontWeight: '600' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters Section */}
        <Card
          style={{
            borderRadius: '12px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: 'none'
          }}
          bodyStyle={{ padding: '20px 24px' }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Search events..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                style={{ borderRadius: '8px', height: '40px' }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Filter by type"
                style={{ width: "100%", borderRadius: '8px' }}
                value={eventTypeFilter}
                onChange={setEventTypeFilter}
                size="large"
              >
                <Option value="all">All Types</Option>
                <Option value="social">Social</Option>
                <Option value="sports">Sports</Option>
                <Option value="educational">Educational</Option>
                <Option value="cultural">Cultural</Option>
                <Option value="other">Other</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Filter by status"
                style={{ width: "100%", borderRadius: '8px' }}
                value={statusFilter}
                onChange={setStatusFilter}
                size="large"
              >
                <Option value="all">All Status</Option>
                <Option value="pending">Pending</Option>
                <Option value="approved">Approved</Option>
                <Option value="rejected">Rejected</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <RangePicker
                style={{ width: "100%", borderRadius: '8px' }}
                onChange={setDateRange}
                placeholder={["Start date", "End date"]}
                size="large"
              />
            </Col>
          </Row>
        </Card>

        {/* Events Display */}
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '300px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
          }}>
            <Spin size="large" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <Card style={{
            textAlign: 'center',
            padding: '60px 20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: 'none'
          }}>
            <Empty
              description="No events found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        ) : activeView === "grid" ? (
          <Row gutter={[16, 16]}>
            {filteredEvents.map((event) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={event._id}>
                <EventCard event={event} />
              </Col>
            ))}
          </Row>
        ) : (
          <div>
            {filteredEvents.map((event) => (
              <EventListItem key={event._id} event={event} />
            ))}
          </div>
        )}

        {/* Reject Modal */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: '8px', fontSize: '20px' }} />
              <span style={{ fontSize: '18px' }}>Reject Event</span>
            </div>
          }
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          okText="Reject"
          okButtonProps={{ danger: true, style: { borderRadius: '8px', height: '40px' } }}
          cancelButtonProps={{ style: { borderRadius: '8px', height: '40px' } }}
          destroyOnClose
          width={500}
          bodyStyle={{ padding: '24px' }}
        >
          <Alert
            message="Rejection Reason"
            description="Please provide a reason for rejecting this event. This will be communicated to the event organizer."
            type="warning"
            showIcon
            style={{ marginBottom: '20px', borderRadius: '8px' }}
          />
          <TextArea
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason..."
            style={{ borderRadius: '8px' }}
          />
        </Modal>

        {/* View Modal - Reduced Size */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CalendarOutlined style={{ marginRight: '12px', color: '#1890ff', fontSize: '20px' }} />
              <span style={{ fontSize: '18px' }}>Event Details</span>
            </div>
          }
          open={viewModalVisible}
          onCancel={handleViewCancel}
          footer={null}
          width={900}
          destroyOnClose
          bodyStyle={{ padding: '0' }}
          style={{ borderRadius: '12px', top: '80px' }}
        >
          {viewEvent && (
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '20px', borderBottom: '1px solid #f0f0f0', paddingBottom: '14px' }}>
                <Title level={3} style={{ margin: 0, marginBottom: '10px', fontSize: '20px' }}>{viewEvent.title}</Title>
                <Space size="middle">
                  <Tag color="blue" style={{ borderRadius: '6px', padding: '3px 8px', fontSize: '12px' }}>
                    {viewEvent.type?.toUpperCase()}
                  </Tag>
                  <Tag
                    style={{
                      borderRadius: '6px',
                      backgroundColor: getStatusBgColor(viewEvent.status),
                      color: getStatusColor(viewEvent.status),
                      border: 'none',
                      padding: '3px 8px',
                      fontSize: '12px'
                    }}
                  >
                    {viewEvent.status?.toUpperCase()}
                  </Tag>
                </Space>
              </div>

              <Tabs defaultActiveKey="details" style={{ marginBottom: '12px' }}>
                <Tabs.TabPane tab="Event Information" key="details">
                  <Row gutter={[20, 20]}>
                    <Col xs={24} md={12}>
                      <Card title="Basic Information" style={{ height: '100%', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', border: 'none' }}>
                        <Descriptions column={1} size="small">
                          <Descriptions.Item label="Start Date">
                            {moment(viewEvent.start_date).format('MMMM DD, YYYY')}
                          </Descriptions.Item>
                          <Descriptions.Item label="End Date">
                            {moment(viewEvent.end_date).format('MMMM DD, YYYY')}
                          </Descriptions.Item>
                          <Descriptions.Item label="Price">
                            <Text strong style={{ color: '#1890ff', fontSize: '15px' }}>${viewEvent.price || 0}</Text>
                          </Descriptions.Item>
                          <Descriptions.Item label="Members Going">
                            <Text strong style={{ fontSize: '15px' }}>{Array.isArray(viewEvent.members_going) ? viewEvent.members_going.length : 0}</Text>
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                    </Col>
                    <Col xs={24} md={12}>
                      <Card title="Event Actions" style={{ height: '100%', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', border: 'none' }}>
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                          {viewEvent.status === "pending" && (
                            <>
                              <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                onClick={() => {
                                  handleViewCancel();
                                  handleApprove(viewEvent._id);
                                }}
                                block
                                style={{ borderRadius: '8px', height: '36px', fontWeight: '500' }}
                              >
                                Approve Event
                              </Button>
                              <Button
                                danger
                                icon={<CloseOutlined />}
                                onClick={() => {
                                  handleViewCancel();
                                  handleReject(viewEvent._id);
                                }}
                                block
                                style={{ borderRadius: '8px', height: '36px', fontWeight: '500' }}
                              >
                                Reject Event
                              </Button>
                            </>
                          )}
                          <Button
                            icon={<DeleteOutlined />}
                            onClick={() => {
                              handleViewCancel();
                              handleDelete(viewEvent._id);
                            }}
                            block
                            danger
                            style={{ borderRadius: '8px', height: '36px', fontWeight: '500' }}
                          >
                            Delete Event
                          </Button>
                        </Space>
                      </Card>
                    </Col>
                  </Row>

                  <Card title="Description" style={{ marginTop: '12px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', border: 'none' }}>
                    <Paragraph style={{ fontSize: '14px', lineHeight: '1.5' }}>{viewEvent.description}</Paragraph>
                  </Card>
                </Tabs.TabPane>

                <Tabs.TabPane tab="Media" key="media">
                  <Row gutter={[20, 20]}>
                    <Col span={24}>
                      <Card title="Banner Image" style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', border: 'none' }}>
                        {(() => {
                          const bannerUrl = getImageUrl(viewEvent.banner_image);
                          const hasBannerError = imageError[`banner-detail-${viewEvent._id}`];

                          return bannerUrl && !hasBannerError ? (
                            <Image
                              src={bannerUrl}
                              alt="Banner"
                              width="100%"
                              style={{ maxWidth: 600, borderRadius: '8px' }}
                              onError={() => handleImageError(`banner-detail-${viewEvent._id}`)}
                            />
                          ) : (
                            <div
                              className="bg-gray-100 flex flex-col items-center justify-center"
                              style={{ height: '220px', borderRadius: '8px', backgroundColor: '#fafafa' }}
                            >
                              <FileImageOutlined style={{ fontSize: '36px', color: '#bfbfbf' }} />
                              <span className="text-gray-400 mt-2">No Image Available</span>
                            </div>
                          )
                        })()}
                      </Card>
                    </Col>

                    {viewEvent.gallery_images && viewEvent.gallery_images.length > 0 && (
                      <Col span={24}>
                        <Card title="Gallery Images" style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', border: 'none' }}>
                          <Row gutter={[12, 12]}>
                            {viewEvent.gallery_images.map((img, idx) => {
                              const imgUrl = getImageUrl(img);
                              const hasImgError = imageError[`gallery-${viewEvent._id}-${idx}`];

                              return (
                                <Col key={idx} span={8}>
                                  {imgUrl && !hasImgError ? (
                                    <Image
                                      src={imgUrl}
                                      alt={`Gallery ${idx + 1}`}
                                      width="100%"
                                      height={130}
                                      style={{ objectFit: "cover", borderRadius: '8px' }}
                                      onError={() => handleImageError(`gallery-${viewEvent._id}-${idx}`)}
                                    />
                                  ) : (
                                    <div
                                      className="bg-gray-100 flex flex-col items-center justify-center"
                                      style={{ height: '130px', borderRadius: '8px', backgroundColor: '#fafafa' }}
                                    >
                                      <FileImageOutlined style={{ fontSize: '24px', color: '#bfbfbf' }} />
                                    </div>
                                  )}
                                </Col>
                              );
                            })}
                          </Row>
                        </Card>
                      </Col>
                    )}
                  </Row>
                </Tabs.TabPane>

                <Tabs.TabPane tab="Statistics" key="stats">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Card style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', border: 'none' }}>
                        <Statistic
                          title="Members Going"
                          value={Array.isArray(viewEvent.members_going) ? viewEvent.members_going.length : 0}
                          prefix={<TeamOutlined />}
                          valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: '600' }}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Card style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', border: 'none' }}>
                        <Statistic
                          title="Price"
                          value={viewEvent.price || 0}
                          prefix={<DollarOutlined />}
                          suffix="$"
                          valueStyle={{ color: '#52c41a', fontSize: '24px', fontWeight: '600' }}
                        />
                      </Card>
                    </Col>
                  </Row>

                  <Card title="Event Timeline" style={{ marginTop: '12px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', border: 'none' }}>
                    <Timeline>
                      <Timeline.Item color="blue" dot={<ClockCircleOutlined />}>
                        <div style={{ fontSize: '14px' }}>Event Created</div>
                        <p style={{ color: '#8c8c8c', marginTop: '4px', fontSize: '13px' }}>{moment(viewEvent.createdAt).format('MMMM DD, YYYY HH:mm')}</p>
                      </Timeline.Item>
                      <Timeline.Item
                        color={viewEvent.status === 'approved' ? 'green' : viewEvent.status === 'rejected' ? 'red' : 'blue'}
                        dot={viewEvent.status === 'approved' ? <CheckOutlined /> : viewEvent.status === 'rejected' ? <CloseOutlined /> : <ClockCircleOutlined />}
                      >
                        <div style={{ fontSize: '14px' }}>
                          {viewEvent.status === 'approved' ? 'Event Approved' : viewEvent.status === 'rejected' ? 'Event Rejected' : 'Event Status: ' + viewEvent.status}
                        </div>
                        {viewEvent.updatedAt && <p style={{ color: '#8c8c8c', marginTop: '4px', fontSize: '13px' }}>{moment(viewEvent.updatedAt).format('MMMM DD, YYYY HH:mm')}</p>}
                      </Timeline.Item>
                      {viewEvent.status === 'approved' && (
                        <Timeline.Item color="green" dot={<CalendarOutlined />}>
                          <div style={{ fontSize: '14px' }}>Event Start Date</div>
                          <p style={{ color: '#8c8c8c', marginTop: '4px', fontSize: '13px' }}>{moment(viewEvent.start_date).format('MMMM DD, YYYY')}</p>
                        </Timeline.Item>
                      )}
                    </Timeline>
                  </Card>
                </Tabs.TabPane>
              </Tabs>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Events;