import React, { useEffect, useMemo, useState, useRef } from 'react';
import { PropTypes } from "prop-types";
import { FaInstagram, FaTwitter, FaTelegramPlane, FaYoutube, FaLink } from 'react-icons/fa';
import { getOneTimeTaskList, completeOneTimeTask, useOneTimeTaskList, useOneTimeTaskListSuccess, useTaskIdToComplete, useUserDetails } from '../sagaStore/slices';
import { useAppDispatch } from '../hooks/storeHooks';
import DynamicNumberDisplay from './DynamicNumberDisplay';

const TaskList = ({ setIsOneTimeTaskOpen }) => {
  const dispatch = useAppDispatch();
  const currentUser = useUserDetails();
  const oneTimeTaskList = useOneTimeTaskList();
  const getOneTimeTaskListSuccess = useOneTimeTaskListSuccess();
  const taskIdToComplete = useTaskIdToComplete();
  const [showTaskModal, setShowTaskModal] = useState(true);
  const [slideUpgrades, setSlideUpgrades] = useState(false);
  const closeAnimTimer = useRef(null);

  useEffect(() => {
    if(!getOneTimeTaskListSuccess){
      dispatch(getOneTimeTaskList());
    }

    // intro animations
    const timerUpgrades = setTimeout(() => {
      setSlideUpgrades(true);
    }, 250);

    return () => {
      clearTimeout(timerUpgrades);
    };

  },[dispatch, getOneTimeTaskListSuccess, oneTimeTaskList]);

  const handleCloseModal = () => {
    if (closeAnimTimer.current){ return; }

    setSlideUpgrades(false);

    closeAnimTimer.current = setTimeout(()=>{
      if(showTaskModal) {
        setShowTaskModal(false);
      }
      setIsOneTimeTaskOpen(false);
    }, 200);
  };

  const getIconComponent = (actionType) => {
    switch (actionType) {
        case 'youtube':
            return FaYoutube;
        case 'instagram':
            return FaInstagram;
        case 'twitter':
            return FaTwitter;
        case 'telegram':
            return FaTelegramPlane;
        default:
            return FaLink;
    }
  };
  const renderOneTimeTaskList = useMemo(() => {
    const handleTaskClick = (task) => {
      window.open(task.url, '_blank');
      const newCompletedTaskArr = currentUser?.completedTask.concat([task.taskId]);
      dispatch(completeOneTimeTask({
        uid: currentUser?.uid,
        coins: task.coins,
        taskId: task.taskId,
        completedTask: newCompletedTaskArr,
      }));
    };

    // Safeguard to ensure `completedTask` is an array to prevent error
    const completedTask = Array.isArray(currentUser?.completedTask) ? currentUser.completedTask : [];
    const sortedTaskList = [...oneTimeTaskList].sort((a, b) => a.index - b.index);
    const sortedCompletedTask = sortedTaskList.sort((a, b) => {
      const aCompleted = completedTask.includes(a.taskId);
      const bCompleted = completedTask.includes(b.taskId);
      return aCompleted - bCompleted;
    });
    
    return (
      sortedCompletedTask.map((task, index) => {
        const IconComponent = getIconComponent(task.actionType);
        const isTaskCompleted = completedTask?.includes(task.taskId);
        return(
          <div
            key={index}
            disabled={taskIdToComplete !== ''}
            className={`${isTaskCompleted ? "" : "dark:hover:bg-[#0a4780] hover:border-1 hover:shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(255,249,228,0.48),0px_5px_4px_0px_rgba(232,140,72,0.48)] transition-all duration-300 hover:scale-[1.025]"} 
            bg-[#003459] w-full py-2 px-6 rounded-md items-center flex space-x-6`}
            onClick={() => isTaskCompleted ? null : handleTaskClick(task)}
          >
            <div className="w-[15%] flex justify-center items-center">
                <IconComponent className={`w-8 h-8 ${isTaskCompleted ? 'text-[#ffc75a]' : 'text-white'}`} />
            </div>
            <div className="flex flex-col grow">
              <p className="text-[1.25rem] md:text-2xl text-left text-[#80E8FF]">{task.title}</p>
              <div className="flex items-center ">
                <div className="flex items-center">
                  <div className="min-w-[215px] text-[1rem] md:text-lg text-[#C5C5C5] font-outfit">
                    <span className="relative top-1 inline-flex items-center">
                      <DynamicNumberDisplay 
                        number={task.coins} 
                        spanClassName={"text-[#FFC85A] text-[1rem] md:text-lg font-LuckiestGuy pr-3"}
                      />
                    </span> 
                    {task.description}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[15%] flex justify-center items-center">
            {(taskIdToComplete !== '' && taskIdToComplete === task.taskId) ?
                // loader
                <div>
                    <svg
                        aria-hidden="true"
                        className="w-8 h-8 text-Fuchsia-200 animate-spin dark:text-Fuchsia-200 fill-yellow-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                        />
                        <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                        />
                    </svg>
                </div>:
                <img
                    className={isTaskCompleted ? "w-10" : "w-9"}
                    src={isTaskCompleted ? "/assets/images/clicker-character/checkedBox.webp" : "/assets/images/clicker-character/checkBox.webp"}
                    alt={isTaskCompleted ? "Checked Checkbox" : "Unchecked Checkbox"}
                />}
            </div>
          </div>
        )
      })
    );
  },[dispatch, oneTimeTaskList, currentUser?.uid, currentUser?.completedTask, taskIdToComplete]);

  return (
    <div className="w-full max-w-[90dvw]">
      <div 
        className={`h-full min-h-[700px] fixed inset-0 flex bg-dark bg-opacity-75 justify-center items-end z-90 transition-all duration-300
        ${slideUpgrades? `opacity-100` : `opacity-0`}`}
        onClick={handleCloseModal}>
        <div
          className={`relative w-full lg:w-[90dvw] h-[90%] rounded-3xl p-3 amt-[10rem] transition-all duration-300 z-[100] ${slideUpgrades? `translate-y-0 opacity-100` : `translate-y-60 opacity-0`}`}
          style={{
            border: "2px solid var(--Color, #F4FBFF)",
            background: "rgba(155, 231, 255, 0.58)",
            boxShadow:
              "0px 8px 30px 0px rgba(4, 161, 183, 0.40) inset, 0px 8px 30px 0px rgba(32, 0, 99, 0.40)",
            backdropFilter: "blur(15px)",
            zIndex: 100,
          }}
            onClick={(e) => e.stopPropagation()}
          >
            
          <div className="absolute flex w-full justify-between -top-9">
            <img
              src={"/assets/images/clicker-character/ring01.webp"}
              alt="ring"
              className="object-cover w-12 absolute left-2"
            />
            <img
              src={"/assets/images/clicker-character/ring02.webp"}
              alt="ring"
              className="object-cover w-12 absolute right-8"
            />
          </div>

          <div className="w-full h-full flex flex-col items-center justify-start gap-1 pt-[1rem] lg:px-[4rem] rounded-3xl"
            style={{
              backgroundImage:
                'url("/assets/images/clicker-character/mascotBg.webp")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <div className="absolute w-full top-0 left-0 flex items-center justify-center px-[4rem] pointer-events-none">
                <img
                  src={"/assets/images/clicker-character/task.webp"}
                  alt="task"
                  className="w-[100%] lg:w-[50%] max-w-[800px] mt-[-1.5rem] xs:mt-[-2rem] lg:mt-[-6rem] overflow-visible"
                />
            </div>

            <div className="w-full flex items-start justify-center">
              <div className="w-full lg:max-w-[70dvw] flex flex-col ">
                <div className="mt-[4rem] lg:mt-[6rem]">
                  <h3 className="text-[1.5rem] lg:text-[2rem] pl-4 text-[#FFAA00]">Complete missions to earn free coins</h3>
                </div>

                <div className="w-full h-full max-h-[50dvh] flex flex-col justify-start gap-3 mt-[2rem] px-4 overflow-x-hidden overflow-y-auto custom-scrollbar z-100">
                  {renderOneTimeTaskList}
                </div>
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
