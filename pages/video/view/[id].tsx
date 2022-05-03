import React, { useRef, useState } from 'react';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import ReactPlayer from 'react-player';
import prisma from '../../../lib/prisma';
import Layout from '../../../components/Layout';
import { Button, Space, Table, Form, Input, InputNumber } from 'antd';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  console.log(params);
  const video = await prisma.video.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      user: {
        select: { email: true },
      },
      tags: {
        select: {
          content: true,
          timestamp: true,
        }
      }
    },
  });
  return {
    props: { video },
  };
};

type Props = {
  video: any,
}

const Video: React.FC<Props> = (props) => {

  const player = useRef<ReactPlayer>();
  const [content, setContent] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timestamp, setTimestamp] = useState<number>();
  const [tempTimestamps, setTempTimestamps] = useState([]);

  const columns = [
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: 'Actions',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => { player.current.seekTo(record.timestamp, 'seconds'); setIsPlaying(true); }}>Watch</Button>
        </Space>
      ),
    },
  ];

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { content, timestamp, videoId: props.video.id };
      const result = await fetch('/api/tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (result.status === 200) {
        setTempTimestamps([...tempTimestamps, { id: Math.random(), content, timestamp }]);
        setContent('');
        setTimestamp(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="video-page">
        <div className="vp-container">
          <div className="vp-left">
            <h1>Video: {props.video.name}</h1>
            <ReactPlayer ref={player} url={props.video.url} controls={true} playing={isPlaying} />
            <div className="form-container">
              <Button
                type="primary"
                onClick={() => { setTimestamp(Math.floor(player.current.getCurrentTime())); }}
              >
                Select Current Timestamp
              </Button>
              <Form style={{ marginTop: 15 }}>
                <Form.Item label="Content">
                  <Input placeholder="Content" value={content} onChange={(e) => { setContent(e.target.value); }} />
                </Form.Item>
                <Form.Item label="Timestamp">
                  <InputNumber style={{ width: '100%' }} placeholder="Timestamp" value={timestamp} onChange={(e) => { setTimestamp(e); }} />
                </Form.Item>
              </Form>
              <Button
                type="primary"
                disabled={((!timestamp && timestamp != 0) || !content || timestamp < 0) ? true : false}
                onClick={(e) => { submitData(e); }}
              >
                Add Tag
              </Button>
            </div>
          </div>
          <div className="vp-right">
            <Table dataSource={[...props.video.tags, ...tempTimestamps]} columns={columns} />
          </div>
        </div>
      </div>
      <style jsx>{`
        .video-page {

        }
        .vp-container {
          display: flex;
        }
        .vp-left {
          width: 50%;
          padding-right: 20px;
        }
        .vp-right {
          width: 50%;
        }
        .form-container {
          margin-top: 15px;
        }
      `}</style>
    </Layout>
  );
};

export default Video;
