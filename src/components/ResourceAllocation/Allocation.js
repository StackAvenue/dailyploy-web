import React, { useState, useEffect } from "react";
import MenuBar from "../dashboard/MenuBar";
import { get, post, del } from "../../utils/API";
import { toast } from "react-toastify";
import DailyPloyToast from "./../DailyPloyToast";
import "../../assets/css/allocation.scss";
import InfinitScroll from "react-infinite-scroll-component";
import { firstTwoLetter, textTitlize } from "../../utils/function";
import { debounce } from "../../utils/function";
import VideoLoader from "../../components/dashboard/VideoLoader";
import Spinner from 'react-bootstrap/Spinner';
import ErrorBoundary from '../../ErrorBoundary';

const Allocation = (props) => {
  const [workspaceId, setWorkspaceId] = useState(null);
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [memberIds, setMemberIds] = useState([]);
  const [projectIds, setProjectIds] = useState([]);
  const [projectMemberMap, setProjectMemberMap] = useState([]);
  const [totalMemberPages, setTotalMemberPages] = useState(null);
  const [count, setCount] = useState(1);
  const [isDeleteShow, setIsDeleteShow] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [projectMemberloaded, setProjectMemberLoaded] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(false)
  const [isMemberAddedRemoved, setIsMemberAddedRemoved] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [isAdded, setIsAdded] = useState(false)
  const [isRemoved, setIsRemoved] = useState(false)
  const [minRowLength, setMinRowLength] = useState([1,2,3,4,5,6,7,8,9,10])
  const [fillProjectRow, setFillProjectRow] = useState([])
  const [fillMemberColumn, setFillMemberColumn] = useState([])
  const [isFillProjectRow, setIsFillProjectRow] = useState(false)
  const [isFillMemberColumn, setIsFillMemberColumn] = useState(false)

  const classNameRoute = () => {
    let route = props.history.location.pathname;
    let routeName = route.split("/")[3];
    if (routeName === "allocation") {
      return "isAllocation";
    } else {
      return false;
    }
  };

  useEffect(() => {
    const { workspaceId } = props.match.params;
    Promise.all([
      get(`workspaces/${workspaceId}/workspace_members?page_number=${count}&page_size=10`),
      get(`workspaces/${workspaceId}/workspace_projects?page_number=1&page_size=30`),
    ]).then(function(responses) {
      fetchMembersAndProjects(responses)
      return responses;
    })
    .catch(function(error){
      console.log(error);
    })
  }, []);

  const fetchMembersAndProjects = (responses) => {
    var members = responses[0].data.members
    setMemberIds(
      members.map((member) => {
        return member.id;
      })
    );
    setMembers(members);
    setCount(count + 1);
    setTotalMemberPages(responses[0].data.total_pages);
    var projects = responses[1].data.projects
    setProjects(projects);
    setProjectIds(
      projects.map((project) => {
        return project.id;
      })
    );
    setIsDataLoaded(true)
  }

  useEffect(() => {
    if(isDataLoaded)
    {
      getProjectMember();
      checkMemberProjectLength();
    }
  },[isDataLoaded])

  useEffect(() => {
    if(isRemoved)
    {
      removeMemberFromProject();
    }
    if(isAdded)
    {
      addMemberToProject();
    }
  }, [isAdded, isRemoved]);

  const showToast = (message) => {
    toast(<DailyPloyToast message={message} status="error" />, {
      autoClose: 2000,
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const getNextMembers = async () => {
    if (count <= totalMemberPages) {
      setProjectMemberLoaded(false)
      try {
        const { data } = await get(
          `workspaces/${workspaceId}/workspace_members?page_number=${count}&page_size=10`
        );
        var nextMemberIds = data.members.map((member) => {
          return member.id;
        })
        mergeProjectMemberMap(data, nextMemberIds)
        setCount(count + 1);
        setMemberIds(memberIds.concat(nextMemberIds)) 
      } catch {
        showToast("Unable to fetch more members");
      }
    }
  };

  const mergeProjectMemberMap = async (memberData, userId) => {
    try {
      let params = {
        user_ids: userId,
        project_ids: projectIds,
      };
      const { data } = await post(
        params,
        `workspaces/${workspaceId}/project_member`
      );
      var results = data.project_member.reduce(function (result, item) {
        var key = Object.keys(item)[0];
        var projectIdSet = new Set(item[key])
        result[key] = projectIdSet;
        return result;
      }, {});
      var map = Object.entries(results);
      var newMap = new Map(map);
      setProjectMemberMap(new Map([...projectMemberMap].concat([...newMap])));
      setMembers(members.concat(memberData.members));
      setProjectMemberLoaded(true)
      setCount(count + 1);
    } catch (e) {
      showToast("Something went wrong. Please contact support");
    }
  }

  const getProjectMember = async () => {
    const { workspaceId } = props.match.params;
    setWorkspaceId(workspaceId);
    try {
      let params = {
        user_ids: memberIds,
        project_ids: projectIds,
      };
      const { data } = await post(
        params,
        `workspaces/${workspaceId}/project_member`
      );
      var results = data.project_member.reduce(function (result, item) {
        var key = Object.keys(item)[0];
        var projectIdSet = new Set(item[key])
        result[key] = projectIdSet;
        return result;
      }, {});
      var map = Object.entries(results);
      var myMap = new Map(map);
      setProjectMemberMap(myMap);
      setProjectMemberLoaded(true)
      setIsDataLoading(true)
      setIsMemberAddedRemoved(false)
    } catch (e) {
      showToast("Something went wrong. Please contact support");
    }
  };

  const removeMemberFromProject = async () => {
    const { workspaceId } = props.match.params;
    try {
      let params = {
        user_ids: [selectedMember],
        project_ids: [selectedProject],
      };
      const { data } = await post(
        params,
        `workspaces/${workspaceId}/project_member`
      );
      var results = data.project_member.reduce(function (result, item) {
        var key = Object.keys(item)[0];
        var projectIdSet = new Set(item[key])
        result[key] = projectIdSet;
        return result;
      }, {});
      var map = Object.entries(results);
      var myMap = new Map(map);
      var projectidsSet = projectMemberMap.get(selectedMember.toString())
      projectidsSet.delete(selectedProject)
      var filteredData = projectMemberMap.set(selectedMember.toString(), projectidsSet)
      setProjectMemberMap(filteredData);
      setProjectMemberLoaded(true)
      setIsDataLoading(true)
      setIsMemberAddedRemoved(false)
      setIsRemoved(false)
    } catch (e) {
      showToast("Something went wrong. Please contact support");
    }
  };

  const addMemberToProject = async () => {
    const { workspaceId } = props.match.params;
    try {
      let params = {
        user_ids: [selectedMember],
        project_ids: [selectedProject],
      };
      const { data } = await post(
        params,
        `workspaces/${workspaceId}/project_member`
      );
      var results = data.project_member.reduce(function (result, item) {
        var key = Object.keys(item)[0];
        var projectIdSet = new Set(item[key])
        result[key] = projectIdSet;
        return result;
      }, {});
      var map = Object.entries(results);
      var myMap = new Map(map);
      var projectidset = projectMemberMap.get(selectedMember.toString())
      if(projectidset == null)
      {
        setProjectMemberMap(new Map([...projectMemberMap].concat([...myMap])));
      }
      else {
        var appendedMemberProject = projectMemberMap.set(selectedMember.toString(), projectidset.add(selectedProject))
        setProjectMemberMap(appendedMemberProject);
      }
      setProjectMemberLoaded(true)
      setIsDataLoading(true)
      setIsMemberAddedRemoved(false)
      setIsAdded(false)
    } catch (e) {
      showToast("Something went wrong. Please contact support");
    }
  };

  const handleOnClick = debounce((projectId, memberId) => {
    setIsMemberAddedRemoved(true);
    if (!checkProjectMemberId(memberId, projectId)) {
      memberAddedRemoved(projectId, memberId)
      setProjectMember(projectId, memberId);
    } else {
      memberAddedRemoved(projectId, memberId)
      removeMember(projectId, memberId);
    }
  }, 250);

  const memberAddedRemoved = (projectId, memberId) => {
    setSelectedMember(memberId)
    setSelectedProject(projectId) 
  }

  const setProjectMember = async (projectId, memberId) => {
    try {
      let params = {
        member_id: memberId,
        project_id: projectId,
      };
      const { data } = await post(
        params,
        `workspaces/${workspaceId}/resource_allocation`
      );
      setIsAdded(true)
    } catch (e) {}
  };

  const removeMember = async (projectId, member) => {
    try {
      let params = {
        project_id: projectId,
      };
      const { data } = await del(
        `workspaces/${workspaceId}/resource_allocation/${member}`,
        params
      );
      setIsRemoved(true)
    } catch (e) {}
  };

  const checkProjectMemberId = (memberId, projectId) => {
    var id = memberId.toString();
    if(projectMemberMap.get(id)!=null)
    {
    const memberProjectId = projectMemberMap.get(id);
    if (memberProjectId.has(projectId)) {
      return true;
    }
      return false;
  }
  }

  const capitalizeName = (memberName) => {
    return memberName.charAt(0).toUpperCase() + memberName.slice(1)
  }

  const checkMemberProjectLength = () => {
    var projectsLength = 10 - projects.length
    var membersLength = 9 - members.length
    if(projectsLength > 0)
    {
      for (var i = 0; i < projectsLength; i++) {
        fillProjectRow[i] = i;
     }
     setIsFillProjectRow(true)
    }
    if(membersLength > 0)
    {
      for (var i = 0; i < membersLength; i++) {
        fillMemberColumn[i] = i;
     }
     setIsFillMemberColumn(true) 
    }
  }

  return (
    <>
      <div className="allocation">
        <ErrorBoundary>
          <MenuBar
            workspaceId={workspaceId}
            classNameRoute={classNameRoute}
            state={isDeleteShow}
          />
        </ErrorBoundary>

        <div className="allocation-container">
          {isDataLoading ? 
          <table className="project-member-table">
            <thead style={{ backgroundColor: "#f2f2f2"}}>
              <tr>
                <th
                  rowspan="2"
                  className="project-name-card"
                  style={{
                    height: "7pc",
                    maxWidth: "15pc",
                    minWidth: "14pc",
                  }}
                ></th>
              </tr>
              <tr>
                {projects.map((project) => {
                  return (
                    <th className="project-name-card">
                      <div className="card">
                        <div
                          className="inner-card"
                          style={{ borderColor: project.project_color }}
                        />
                        <div
                          className="project-name"
                          style={{ marginTop: "17px", textOverflow: "ellipsis" }}
                        >
                          <div className="project-name-hover">{project.name}</div>
                          <div className={`${project.name.length > 8 ? "hover-detail" : "hide"}`}>{project.name}</div>
                        </div>
                      </div>
                    </th>
                  );
                })}
                {isFillProjectRow && fillProjectRow.map((row) => {
                  return (
                    <th className="project-name-card">
                    </th>
                  )
                })}
              </tr>
            </thead>

            <tbody>
              {members.map((member) => {
                return (
                  <tr className="member-row">
                    <td
                      style={{ backgroundColor: "#f2f2f2", fontSize: "17px", textTransform: "capitalize" }}
                    ><div style={{ display:"flex" }}>
                      <div
                        className="member-name-card"
                        title={textTitlize(member.name)}
                        style={{
                          position: "inherit",
                          marginLeft: "23px",
                          marginRight: "12px",
                        }}
                      >
                        <span>{firstTwoLetter(member.name)}</span>
                      </div>
                      <div className="member-name">{capitalizeName(member.name)}</div>
                      <div className={`${member.name.length > 16 ? 
                        "hover-detail" : "hide"}`}>
                          {capitalizeName(member.name)}</div>
                          </div>
                    </td>
                    {projects.map((project) => {
                      return (
                        <td
                          className={`${
                            member.id > 0 &&
                            project.id > 0 &&
                            projectMemberloaded &&
                            checkProjectMemberId(member.id, project.id)
                              ? "project-member-true"
                              : "project-member-false"
                          }`}
                          onClick={() => {
                            handleOnClick(project.id, member.id);
                          }}
                        >
                          {isMemberAddedRemoved===true && selectedMember === member.id 
                          && selectedProject === project.id
                          ? <Spinner animation="grow" variant="success" /> :
                          member.id > 0 &&
                          project.id > 0 &&
                          projectMemberloaded &&
                          checkProjectMemberId(member.id, project.id)
                            ? "- Remove"
                            : "+ Add to Project"}
                        </td>
                      );
                    })}
                    {isFillProjectRow && fillProjectRow.map((a) => {
                      return (
                        <td className="project-member-extends"></td>
                      )
                    })}
                  </tr>
                );
              })}
              {isFillMemberColumn && fillMemberColumn.map((member) => {
                return (
                  <tr className="member-row">
                    <td
                      style={{ backgroundColor: "#f2f2f2", fontSize: "17px", textTransform: "capitalize" }}
                    ><div style={{ display:"flex" }}>
                    </div>
                    </td>
                    {minRowLength.map((row) => {
                      return (
                        <td className="project-member-extends"></td>
                      )
                    })}
                  </tr>
                );
              })}
              <ErrorBoundary>
                <InfinitScroll
                  dataLength={members.length}
                  next={getNextMembers}
                  hasMore={true}
                ></InfinitScroll>
              </ErrorBoundary>
              {projectMemberloaded ? null : 
              <>
              <Spinner animation="border" variant="success" />
              <div style={{ height:"4pc" }}></div></>}
            </tbody>
          </table>
          : <VideoLoader/>}
        </div>
      </div>
    </>
  );
};

export default Allocation;
