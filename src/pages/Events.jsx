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
  Statistic,
  Spin,
  Avatar,
  Timeline,
  Tabs,
  List,
  Rate,
  Descriptions,
  Divider,
  Badge,
  DatePicker,
  Select,
  Upload,
  Progress,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  FileImageOutlined,
  TeamOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  StarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  UploadOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

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
  const [activeTabKey, setActiveTabKey] = useState("pending");
  const [searchText, setSearchText] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState(null);
  const [imageError, setImageError] = useState({});
  const [activeView, setActiveView] = useState("grid"); // grid or list
  const [refreshKey, setRefreshKey] = useState(0); // For refreshing data

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const token = localStorage.getItem("admin-auth");

  // Fetch events
  const fetchEvents = async () => {
    setLoading(true);
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
      setEvents(Array.isArray(data.events) ? data.events : []);
    } catch (err) {
      console.log(err);
      message.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews
  const fetchReviews = async () => {
    setLoadingReviews(true);
    if (!token) {
      setLoadingReviews(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/events/reviews/admin/reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchReviews();
  }, [refreshKey]);

  // Filtering events
  useEffect(() => {
    let filtered = [...events];

    // Filter by active tab
    if (activeTabKey !== "all") {
      filtered = filtered.filter(e => e.status === activeTabKey);
    }

    if (eventTypeFilter !== "all") filtered = filtered.filter(e => e.type === eventTypeFilter);
    if (searchText) filtered = filtered.filter(e =>
      e.title.toLowerCase().includes(searchText.toLowerCase()) ||
      e.type.toLowerCase().includes(searchText.toLowerCase())
    );
    if (dateRange && dateRange.length === 2) {
      filtered = filtered.filter(event => {
        const eventStartDate = moment(event.start_date);
        return eventStartDate.isBetween(dateRange[0], dateRange[1], 'day', '[]');
      });
    }

    setFilteredEvents(filtered);
  }, [events, activeTabKey, eventTypeFilter, searchText, dateRange]);

  // Event actions
  const handleApprove = async (id) => {
    if (!token) return message.error("Token missing – Login again");
    try {
      const res = await fetch(`${API_BASE}/events/admin/approve/${id}`, { 
        method: "PUT", 
        headers: { 
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json" 
        } 
      });
      
      if (res.ok) {
        message.success("Event approved successfully!");
        // Update the event status in local state
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === id ? { ...event, status: 'approved' } : event
          )
        );
        // Refresh data to ensure consistency
        setRefreshKey(prev => prev + 1);
      } else {
        const errorData = await res.json();
        message.error(errorData.message || "Failed to approve event");
      }
    } catch (err) {
      console.error("Approval error:", err);
      message.error("Network error while approving event");
    }
  };

  const handleReject = (id) => {
    setCurrentEventId(id);
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    if (!rejectionReason.trim()) return message.error("Please enter a rejection reason!");
    if (!token) return message.error("Token missing – Login again");
    
    try {
      const res = await fetch(`${API_BASE}/events/admin/reject/${currentEventId}`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`, 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ rejection_reason: rejectionReason }),
      });
      
      if (res.ok) {
        message.success("Event rejected successfully!");
        setIsModalVisible(false);
        setRejectionReason("");
        // Update the event status in local state
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === currentEventId ? { ...event, status: 'rejected', rejection_reason: rejectionReason } : event
          )
        );
        // Refresh data to ensure consistency
        setRefreshKey(prev => prev + 1);
      } else {
        const errorData = await res.json();
        message.error(errorData.message || "Failed to reject event");
      }
    } catch (err) {
      console.error("Rejection error:", err);
      message.error("Network error while rejecting event");
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
        if (!token) return message.error("Token missing – Login again");
        try {
          const res = await fetch(`${API_BASE}/events/admin/delete/${id}`, { 
            method: 'DELETE', 
            headers: { 
              Authorization: `Bearer ${token}`, 
              "Content-Type": "application/json" 
            } 
          });
          
          if (res.ok) {
            message.success("Event deleted successfully!");
            // Remove the event from local state
            setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
            // Refresh data to ensure consistency
            setRefreshKey(prev => prev + 1);
          } else {
            const errorData = await res.json();
            message.error(errorData.message || "Failed to delete event");
          }
        } catch (err) {
          console.error("Deletion error:", err);
          message.error("Network error while deleting event");
        }
      },
    });
  };

  const getStatusColor = (status) => ({
    approved: "#52c41a",
    pending: "#faad14",
    rejected: "#f5222d"
  }[status] || "#d9d9d9");

  const getStatusBgColor = (status) => ({
    approved: "#f6ffed",
    pending: "#fffbe6",
    rejected: "#fff2f0"
  }[status] || "#f5f5f5");

  const handleImageError = (imageId) => {
    setImageError(prev => ({ ...prev, [imageId]: true }));
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${API_BASE}/${cleanPath}`;
  };

  const getStatusCount = (status) => {
    if (status === "all") return events.length;
    return events.filter(e => e.status === status).length;
  };

  // Event Card
  const EventCard = ({ event }) => {
    const bannerUrl = getImageUrl(event.banner_image);
    const hasBannerError = imageError[`banner-${event.id}`];
    
    return (
      <Card
        hoverable
        style={{ height: '100%', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '0' }}
        cover={
          <div style={{ height: '180px', position: 'relative' }}>
            {bannerUrl && !hasBannerError ? (
              <Image src={bannerUrl} alt={event.title} height={180} style={{ objectFit: "cover", width: '100%' }} preview={false} onError={() => handleImageError(`banner-${event.id}`)} />
            ) : (
              <div style={{ height: '180px', backgroundColor: '#fafafa', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <FileImageOutlined style={{ fontSize: '32px', color: '#bfbfbf' }} />
                <span style={{ color: '#bfbfbf', fontSize: '12px', marginTop: '4px' }}>No Image</span>
              </div>
            )}
            <div style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: getStatusBgColor(event.status), color: getStatusColor(event.status), padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
              {event.status?.toUpperCase()}
            </div>
          </div>
        }
        actions={[
          <Tooltip title="View Details" key="view">
            <EyeOutlined onClick={() => handleView(event)} />
          </Tooltip>,
          ...(event.status === "pending" ? [
            <Tooltip title="Approve" key="approve">
              <CheckOutlined onClick={() => handleApprove(event.id)} style={{ color: '#52c41a' }} />
            </Tooltip>,
            <Tooltip title="Reject" key="reject">
              <CloseOutlined onClick={() => handleReject(event.id)} style={{ color: '#f5222d' }} />
            </Tooltip>
          ] : []),
          <Tooltip title="Delete" key="delete">
            <DeleteOutlined onClick={() => handleDelete(event.id)} style={{ color: '#f5222d' }} />
          </Tooltip>
        ]}
      >
        <Card.Meta
          title={<Text strong>{event.title}</Text>}
          description={
            <div>
              <Tag color="blue">{event.type?.toUpperCase()}</Tag>
              <Text style={{ marginLeft: '8px', fontSize: '12px' }}>{moment(event.start_date).format('MMM DD, YYYY')}</Text>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <Text strong>${event.price || 0}</Text>
                <Text><TeamOutlined /> {Array.isArray(event.members_going) ? event.members_going.length : 0}</Text>
              </div>
            </div>
          }
        />
      </Card>
    );
  };

  // Event List Item
  const EventListItem = ({ event }) => {
    const bannerUrl = getImageUrl(event.banner_image);
    const hasBannerError = imageError[`banner-${event.id}`];
    
    return (
      <Card style={{ marginBottom: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Row gutter={16}>
          <Col span={4}>
            {bannerUrl && !hasBannerError ? (
              <Image src={bannerUrl} alt={event.title} height={100} width={140} style={{ objectFit: "cover", borderRadius: '8px' }} preview={false} onError={() => handleImageError(`banner-${event.id}`)} />
            ) : (
              <div style={{ height: '100px', width: '140px', backgroundColor: '#fafafa', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <FileImageOutlined style={{ fontSize: '24px', color: '#bfbfbf' }} />
              </div>
            )}
          </Col>
          <Col span={14}>
            <Title level={4}>{event.title}</Title>
            <Tag color="blue">{event.type?.toUpperCase()}</Tag>
            <Tag style={{ backgroundColor: getStatusBgColor(event.status), color: getStatusColor(event.status) }}>{event.status?.toUpperCase()}</Tag>
            <div>${event.price || 0}</div>
            <div><TeamOutlined /> {Array.isArray(event.members_going) ? event.members_going.length : 0}</div>
          </Col>
          <Col span={6}>
            <Space>
              <Tooltip title="View Details">
                <Button icon={<EyeOutlined />} onClick={() => handleView(event)} />
              </Tooltip>
              {event.status === "pending" && (
                <>
                  <Tooltip title="Approve">
                    <Button type="primary" icon={<CheckOutlined />} onClick={() => handleApprove(event.id)} />
                  </Tooltip>
                  <Tooltip title="Reject">
                    <Button danger icon={<CloseOutlined />} onClick={() => handleReject(event.id)} />
                  </Tooltip>
                </>
              )}
              <Tooltip title="Delete">
                <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(event.id)} />
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </Card>
    );
  };

  // View Event Modal
  const ViewEventModal = () => {
    if (!viewEvent) return null;
    
    const bannerUrl = getImageUrl(viewEvent.banner_image);
    const galleryUrls = Array.isArray(viewEvent.gallery_images) 
      ? viewEvent.gallery_images.map(img => getImageUrl(img)).filter(Boolean)
      : [];
    
    return (
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>Event Details</span>
            <Tag 
              style={{ marginLeft: '10px' }} 
              color={viewEvent.status === 'approved' ? 'green' : viewEvent.status === 'rejected' ? 'red' : 'orange'}
            >
              {viewEvent.status?.toUpperCase()}
            </Tag>
          </div>
        }
        open={viewModalVisible}
        onCancel={handleViewCancel}
        width={900}
        footer={[
          <Button key="close" onClick={handleViewCancel}>
            Close
          </Button>,
          ...(viewEvent.status === "pending" ? [
            <Button 
              key="approve" 
              type="primary" 
              icon={<CheckOutlined />}
              onClick={() => {
                handleApprove(viewEvent.id);
                handleViewCancel();
              }}
            >
              Approve
            </Button>,
            <Button 
              key="reject" 
              danger 
              icon={<CloseOutlined />}
              onClick={() => {
                handleReject(viewEvent.id);
                handleViewCancel();
              }}
            >
              Reject
            </Button>
          ] : []),
          <Button 
            key="delete" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => {
              handleDelete(viewEvent.id);
              handleViewCancel();
            }}
          >
            Delete
          </Button>
        ]}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div style={{ position: 'relative' }}>
              {bannerUrl && !imageError[`view-${viewEvent.id}`] ? (
                <Image 
                  src={bannerUrl} 
                  alt={viewEvent.title} 
                  height={200} 
                  style={{ objectFit: "cover", width: '100%', borderRadius: '8px' }} 
                  preview={false} 
                  onError={() => handleImageError(`view-${viewEvent.id}`)} 
                />
              ) : (
                <div style={{ height: '200px', backgroundColor: '#fafafa', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', borderRadius: '8px' }}>
                  <FileImageOutlined style={{ fontSize: '48px', color: '#bfbfbf' }} />
                  <span style={{ color: '#bfbfbf', fontSize: '16px', marginTop: '8px' }}>No Banner Image</span>
                </div>
              )}
            </div>
          </Col>
          
          <Col span={24}>
            <Title level={3}>{viewEvent.title}</Title>
            <Space wrap>
              <Tag color="blue">{viewEvent.type?.toUpperCase()}</Tag>
              <Tag color="purple">{viewEvent.event_mode?.toUpperCase()}</Tag>
              <Tag color="green">${viewEvent.price || 0}</Tag>
              <Tag icon={<TeamOutlined />}>{Array.isArray(viewEvent.members_going) ? viewEvent.members_going.length : 0} Going</Tag>
            </Space>
          </Col>
          
          <Col span={24}>
            <Divider orientation="left">Event Information</Divider>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Start Date">
                {moment(viewEvent.start_date).format('MMMM DD, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="End Date">
                {viewEvent.end_date ? moment(viewEvent.end_date).format('MMMM DD, YYYY') : 'Not specified'}
              </Descriptions.Item>
              <Descriptions.Item label="Start Time">
                {viewEvent.start_time || 'Not specified'}
              </Descriptions.Item>
              <Descriptions.Item label="End Time">
                {viewEvent.end_time || 'Not specified'}
              </Descriptions.Item>
              <Descriptions.Item label="Event URL" span={2}>
                {viewEvent.event_url ? (
                  <a href={viewEvent.event_url} target="_blank" rel="noopener noreferrer">
                    {viewEvent.event_url}
                  </a>
                ) : 'Not specified'}
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {viewEvent.description || 'No description provided'}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          
          {viewEvent.event_mode !== 'online' && (
            <Col span={24}>
              <Divider orientation="left">Location Information</Divider>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Venue">
                  {viewEvent.venue_name || 'Not specified'}
                </Descriptions.Item>
                <Descriptions.Item label="Country">
                  {viewEvent.country || 'Not specified'}
                </Descriptions.Item>
                <Descriptions.Item label="State">
                  {viewEvent.state || 'Not specified'}
                </Descriptions.Item>
                <Descriptions.Item label="City">
                  {viewEvent.city || 'Not specified'}
                </Descriptions.Item>
                <Descriptions.Item label="Address" span={2}>
                  {viewEvent.location || 'Not specified'}
                </Descriptions.Item>
                <Descriptions.Item label="Landmark">
                  {viewEvent.landmark || 'Not specified'}
                </Descriptions.Item>
                <Descriptions.Item label="Zip Code">
                  {viewEvent.zip_code || 'Not specified'}
                </Descriptions.Item>
                <Descriptions.Item label="Venue Description" span={2}>
                  {viewEvent.venue_description || 'Not specified'}
                </Descriptions.Item>
                <Descriptions.Item label="Parking Info" span={2}>
                  {viewEvent.parking_info || 'Not specified'}
                </Descriptions.Item>
                <Descriptions.Item label="Accessibility Info" span={2}>
                  {viewEvent.accessibility_info || 'Not specified'}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          )}
          
          {viewEvent.event_mode === 'online' && (
            <Col span={24}>
              <Divider orientation="left">Online Event Information</Divider>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Online Instructions">
                  {viewEvent.online_instructions || 'Not specified'}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          )}
          
          <Col span={24}>
            <Divider orientation="left">What's Included</Divider>
            <Paragraph>{viewEvent.what_is_included || 'Not specified'}</Paragraph>
          </Col>
          
          <Col span={24}>
            <Divider orientation="left">What's Not Included</Divider>
            <Paragraph>{viewEvent.what_is_not_included || 'Not specified'}</Paragraph>
          </Col>
          
          {galleryUrls.length > 0 && (
            <Col span={24}>
              <Divider orientation="left">Gallery Images</Divider>
              <Image.PreviewGroup>
                <Row gutter={[8, 8]}>
                  {galleryUrls.map((url, index) => (
                    <Col span={6} key={index}>
                      <Image
                        width="100%"
                        height={120}
                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                        src={url}
                        alt={`Gallery image ${index + 1}`}
                      />
                    </Col>
                  ))}
                </Row>
              </Image.PreviewGroup>
            </Col>
          )}
          
          {viewEvent.status === 'rejected' && viewEvent.rejection_reason && (
            <Col span={24}>
              <Divider orientation="left">Rejection Reason</Divider>
              <div style={{ backgroundColor: '#fff2f0', padding: '10px', borderRadius: '6px' }}>
                <Text type="danger">{viewEvent.rejection_reason}</Text>
              </div>
            </Col>
          )}
        </Row>
      </Modal>
    );
  };

  // Tab content components
  const renderEventContent = () => (
    <>
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input 
              placeholder="Search events..." 
              value={searchText} 
              onChange={(e) => setSearchText(e.target.value)} 
              prefix={<FilterOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select 
              style={{ width: '100%' }} 
              placeholder="Event Type" 
              value={eventTypeFilter} 
              onChange={setEventTypeFilter}
            >
              <Option value="all">All Types</Option>
              <Option value="meetup">Meetup</Option>
              <Option value="festival">Festival</Option>
              <Option value="party">Party</Option>
              <Option value="conference">Conference</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker 
              style={{ width: '100%' }} 
              onChange={setDateRange} 
              placeholder={['Start Date', 'End Date']}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space>
              <Button 
                icon={activeView === "grid" ? null : <FilterOutlined />} 
                onClick={() => setActiveView("grid")}
                type={activeView === "grid" ? "primary" : "default"}
              >
                Grid
              </Button>
              <Button 
                icon={activeView === "list" ? null : <FilterOutlined />} 
                onClick={() => setActiveView("list")}
                type={activeView === "list" ? "primary" : "default"}
              >
                List
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={() => setRefreshKey(prev => prev + 1)}
                title="Refresh"
              />
            </Space>
          </Col>
        </Row>
      </Card>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <Card style={{ textAlign: "center" }}>
          <Empty description={`No ${activeTabKey} events found`} />
        </Card>
      ) : activeView === "grid" ? (
        <Row gutter={[16, 16]}>
          {filteredEvents.map(event => (
            <Col xs={24} sm={12} lg={8} xl={6} key={event.id}>
              <EventCard event={event} />
            </Col>
          ))}
        </Row>
      ) : (
        <div>
          {filteredEvents.map(event => (
            <EventListItem key={event.id} event={event} />
          ))}
        </div>
      )}
    </>
  );

  // Tab items configuration
  const tabItems = [
    {
      key: 'pending',
      label: (
        <Badge count={getStatusCount("pending")} offset={[10, 0]}>
          <span>Pending Events</span>
        </Badge>
      ),
      children: renderEventContent()
    },
    {
      key: 'approved',
      label: (
        <Badge count={getStatusCount("approved")} offset={[10, 0]}>
          <span>Approved Events</span>
        </Badge>
      ),
      children: renderEventContent()
    },
    {
      key: 'rejected',
      label: (
        <Badge count={getStatusCount("rejected")} offset={[10, 0]}>
          <span>Rejected Events</span>
        </Badge>
      ),
      children: renderEventContent()
    },
    {
      key: 'reviews',
      label: 'Reviews',
      children: (
        <>
          {loadingReviews ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Spin size="large" />
            </div>
          ) : reviews.length === 0 ? (
            <Card style={{ textAlign: "center" }}>
              <Empty description="No reviews found" />
            </Card>
          ) : (
            <List
              itemLayout="vertical"
              size="large"
              dataSource={reviews}
              renderItem={review => (
                <Card style={{ marginBottom: '16px' }}>
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={review.userAvatar || null}>{review.userName?.[0]}</Avatar>}
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text strong>{review.userName}</Text>
                          <Rate disabled defaultValue={review.rating || 0} character={<StarOutlined />} />
                        </div>
                      }
                      description={<Text type="secondary">{moment(review.createdAt).format("MMMM DD, YYYY")}</Text>}
                    />
                    <Paragraph style={{ marginTop: "8px" }}>{review.comment}</Paragraph>
                  </List.Item>
                </Card>
              )}
            />
          )}
        </>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <Tabs 
          activeKey={activeTabKey} 
          onChange={setActiveTabKey}
          items={tabItems}
        />
      </div>

      {/* Reject Modal */}
      <Modal 
        title="Reject Event" 
        open={isModalVisible} 
        onOk={handleModalOk} 
        onCancel={handleModalCancel} 
        okText="Reject" 
        okButtonProps={{ danger: true }}
      >
        <TextArea 
          rows={4} 
          value={rejectionReason} 
          onChange={(e) => setRejectionReason(e.target.value)} 
          placeholder="Please enter a reason for rejecting this event..." 
        />
      </Modal>

      {/* View Event Modal */}
      <ViewEventModal />
    </div>
  );
};

export default Events;