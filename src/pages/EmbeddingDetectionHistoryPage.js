import {Button, Empty, List, message, Spin, Splitter} from "antd";
import {useEffect, useState} from "react";

import "./EmbeddingDetectionHistoryPage.css"
import {eel} from "../eel.js";
import type {EmbDetectionRunData} from "../types/EmbDetectionRunData.schema.d";
import {DeleteFilled} from "@ant-design/icons";
import {EmbeddingDetectionRunDetails} from "../components/EmbeddingDetectionRunDetails";
import {StatusIcon} from "../components/StatusIcon";

export function EmbeddingDetectionHistoryPage({pageNo = 0, pageSize = 0}: {
  pageNo?: number,
  pageSize?: number
}) {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [activeRunUuid, setActiveRunUuid] = useState(null);
  const [error, setError] = useState(null);
  const [runs, setRuns] = useState([]);
  const [data, setData] = useState([]);

  function loadHistory() {
    setLoading(true);
    // noinspection JSUnresolvedReference
    eel.fetchEmbeddingDetectionRuns(pageNo, pageSize)(
        function (runs) {
          setLoading(false);
          setRuns(runs);
        },
        function (error) {
          setLoading(false);
          setError(error);
        }
    );
  }

  useEffect(() => loadHistory(), [])
  useEffect(() => {
    setData(runs.map((run: EmbDetectionRunData, i) => {
      return {
        key: i,
        uuid: run.uuid,
        launchedDate: run.launchedDate,
        finishedDate: run.finishedDate,
        nTotal: run.nTotal,
        nProcessed: run.nProcessed,
        status: run.status,
        percent: !run.nTotal ? null : Math.round(run.nProcessed / run.nTotal * 100),
      }
    }))
  }, [runs])

  function selectRun(event, runUuid: string) {
    event.stopPropagation();
    setActiveRunUuid(runUuid);
  }

  function deleteRun(event, runUuid: string) {
    event.stopPropagation();
    messageApi.open({
          type: 'error',
          content: "Not implemented yet! You need to delete by UUID " + runUuid,
        }
    ).then();
  }

  return (
      <>
        {contextHolder}
          <Splitter className="h-full">
            <Splitter.Panel defaultSize={360} min={240} collapsible>
              {
                  loading &&
                  <Spin/>
              }

              {
                  !loading && runs &&
                  <List
                      className={"bg-white h-full text-left transition-colors"}
                      loading={loading}
                      itemLayout="horizontal"
                      locale={{emptyText: 'Empty History'}}
                      dataSource={data}
                      renderItem={(item) => (
                          <List.Item
                              className={"transition-all h-16 hover:h-32 cursor-pointer " + (item.uuid === activeRunUuid ? "bg-blue-100" : "hover:bg-blue-50")}
                              onClick={(e) => selectRun(e, item.uuid)}>
                            <div
                                className="p-4 pt-2 pb-1 gap-4 w-full flex flex-row justify-between items-center group">
                              <StatusIcon status={item.status} className="text-xl"/>
                              <div className="grow flex flex-col">
                                {item.uuid}
                                <span className="text-gray-400">{item.launchedDate}</span>
                              </div>
                              <div
                                  className="absolute right-0 p-4 hidden group-hover:block">
                                <Button
                                    type="dashed" shape="circle" icon={<DeleteFilled/>}
                                    onClick={(e) => deleteRun(e, item.uuid)}/>
                              </div>
                            </div>
                          </List.Item>
                      )}
                  />
              }

              {
                  error &&
                  <span>
                    Failed to load data, <a className="text-blue-600"
                                            onClick={loadHistory}>try again</a>?
                  </span>
              }
            </Splitter.Panel>

            <Splitter.Panel collapsible>
              {
                activeRunUuid ?
                    <EmbeddingDetectionRunDetails runUuid={activeRunUuid}/> :
                    <Empty className="mt-16" description="No Detection Run Selected"/>
              }
            </Splitter.Panel>
          </Splitter>
      </>
  )
}