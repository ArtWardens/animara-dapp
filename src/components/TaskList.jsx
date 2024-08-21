import React, { useEffect, useMemo, useState } from 'react';
import { PropTypes } from "prop-types";
import { Box, Modal } from '@mui/material';
import { getOneTimeTaskList, completeOneTimeTask, useOneTimeTaskList, useOneTimeTaskListSuccess, useUserDetails } from '../sagaStore/slices';
import { useAppDispatch } from '../hooks/storeHooks';

const TaskList = ({ setIsOneTimeTaskOpen }) => {
  const dispatch = useAppDispatch();
  const currentUser = useUserDetails();
  const oneTimeTaskList = useOneTimeTaskList();
  const getOneTimeTaskListSuccess = useOneTimeTaskListSuccess();
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [currentTask, setCurrentTask] = useState({});

  useEffect(() => {
    if(!getOneTimeTaskListSuccess){
      dispatch(getOneTimeTaskList());
    }
  },[dispatch, getOneTimeTaskListSuccess]);

  const handleCloseModal = () => {
    setIsOneTimeTaskOpen(false);
    setCurrentTask({});
  };

  const handleOpenTaskModal = (modal) => {
    setOpenTaskModal(modal);
  };

  const handleModalTask = () => {
    window.open(currentTask.url, '_blank');
    dispatch(completeOneTimeTask({
      taskId: currentTask.taskId,
    }));
    setIsOneTimeTaskOpen(false);
  };

  const renderOneTimeTaskList = useMemo(() => {
    const handleLinkTask = (task) => {
      window.open(task.url, '_blank');
      const newCompletedTaskArr = currentUser?.completedTask.concat([task.taskId])
      dispatch(completeOneTimeTask({
        uid: currentUser?.uid,
        coins: task.coins,
        completedTask: newCompletedTaskArr,
      }));
    };

    const completedTask = currentUser?.completedTask;
    const sortedTaskList = [...oneTimeTaskList].sort((a, b) => a.index - b.index);
    const sortedCompletedTask = sortedTaskList.sort((a, b) => {
      const aCompleted = completedTask.includes(a.taskId);
      const bCompleted = completedTask.includes(b.taskId);
      return aCompleted - bCompleted;
    });
    
    return (
      sortedCompletedTask.map((item, index) => {
        const disabled = completedTask?.includes(item.taskId)
        return(
          <div
            key={index}
            className={`${disabled ? "opacity-50" : "opacity-100"} bg-gray/20 w-full py-2 px-3.5 rounded-md items-center flex space-x-6`}
            onClick={() => {
              if(!disabled){
                switch(item.actionType){
                  case "url":
                    handleLinkTask(item);
                    break;
                  case "modal":
                    handleOpenTaskModal(item.modal);
                    break;
                  default:
                    break;
                }
                setCurrentTask(item);
              }
            }}
          >
            <div className="bg-yellow-400 size-7" />
            <div className="flex flex-col">
              <p>{item.title}</p>
              <div className="flex items-center ">
                <img src="/assets/images/gem2.png" className="cursor-pointer h-4" alt="gem2" />
                <div className="pl-2 flex items-center">
                  <p className="text-blue-200">
                    +{item.coins}
                    {item.description && <span className="text-zinc-400 pl-3">{item.description}</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })
    );
  },[dispatch, oneTimeTaskList, currentUser?.uid, currentUser?.completedTask]);

  return (
    <div className="fixed inset-0 overflow-y-auto z-[10000]">
      <div className="absolute inset-0 bg-pink-300 z-[100001]">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat z-[100001]"
          style={{ backgroundImage: 'url(/assets/images/Light.png)' }}
        >
          <div className="absolute top-4 left-4">
            <img src="/assets/images/username.png" className="cursor-pointer h-16" alt="username" />
            <p className="text-white absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/3 w-20 truncate">
              <span>{`${currentUser?.first_name} ${currentUser?.last_name}`}</span>
            </p>
          </div>
          <div className="w-screen h-screen flex ">
            <div className="relative bg-black h-full max-h-[80%] w-full max-w-screen-sm m-auto flex justify-center rounded-2xl">
              <div onClick={handleCloseModal} className="absolute -top-4 -right-6">
                <img src="/assets/images/x.png" width={50} height={50} className="cursor-pointer" alt="x" />
              </div>
              <div className="flex flex-1 flex-col space-y-5 max-w-[80%] py-10">
                <p className="flex items-center justify-center space-x-3 text-lg">
                  <img src="/assets/images/gem2.png" className="cursor-pointer h-8" alt="gem2" />
                  <span>{currentUser.coins}</span>
                </p>
                <p className="text-lg px-3.5">available tasks</p>
                <div className="max-h-[80%] h-full overflow-y-auto px-3.5 space-y-2 one-time-scrollbar">
                  {renderOneTimeTaskList}
                </div>
                <Modal
                  open={openTaskModal === "promo-video"}
                  onClose={() => setOpenTaskModal(false)}
                  aria-labelledby="task-modal-title"
                  aria-describedby="task-modal-description"
                  ond
                >
                  <Box
                    className="bg-black items-center justify-center flex flex-col space-y-10 w-fit min-w-64 py-8"
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      boxShadow: 24,
                      borderRadius: 6,
                    }}
                  >
                    <div className="flex space-y-4 flex-col items-center">
                      <div className="size-20 bg-gray-500"></div>
                      <div className="text-center">
                        <h2 id="task-modal-title">{currentTask?.title}</h2>
                        <p id="task-modal-description">{currentTask?.description}</p>
                      </div>
                    </div>
                    <button className="bg-blue-500 rounded px-3.5 py-2 max-w-28 text-sm" onClick={handleModalTask}>
                      Watch Video to complete task
                    </button>
                  </Box>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TaskList.propTypes = {
  setIsOneTimeTaskOpen: PropTypes.func,
}

export default TaskList;
