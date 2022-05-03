import React from "react"
import Router from "next/router";
import { Table, Space } from 'antd';
import { GetServerSideProps } from "next"
import Link from 'next/link'
import prisma from '../lib/prisma'
import Layout from "../components/Layout"

export const getServerSideProps: GetServerSideProps = async () => {
  const videos = await prisma.video.findMany({
    include: {
      user: {
        select: { name: true },
      },
    },
  });
  return { props: { videos } };
};

type Props = {
  videos: any[]
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'URL',
    dataIndex: 'url',
    key: 'url',
  },
  {
    title: 'Actions',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <Link href={`/video/view/${record.id}`}>Watch</Link>
      </Space>
    ),
  },
];

const Home: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>Videos</h1>
        <main>
          <Table dataSource={props.videos} columns={columns} />
        </main>
      </div>
    </Layout>
  )
}

export default Home
