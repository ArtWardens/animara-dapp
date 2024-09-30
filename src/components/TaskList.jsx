import React, { useEffect, useMemo, useState } from 'react';
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

  useEffect(() => {
    if(!getOneTimeTaskListSuccess){
      dispatch(getOneTimeTaskList());
    }
  },[dispatch, getOneTimeTaskListSuccess, oneTimeTaskList]);

  const handleCloseModal = () => {
    if(showTaskModal) {
      setShowTaskModal(false);
    }
    
    const timerPanel = setTimeout(() => {
      setIsOneTimeTaskOpen(false);
    }, 300);

    return () => {
      clearTimeout(timerPanel);
    };
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
                  <div className="text-[1rem] md:text-lg text-[#C5C5C5] font-outfit">
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
    <div
      className={`fixed left-0 top-0 flex h-full w-full items-center justify-center bg-dark/90 px-4 py-4 rounded-3xl`}
      onClick={handleCloseModal}
      style={{
        zIndex: 90,
      }}
    >
      <div
        className={`
              relative w-[100%] max-w-[1000px] max-h-[95%] px-[2rem] py-[6rem] rounded-[20px] text-center 
              bg-cover bg-no-repeat 
              md:px-[4rem] md:py-[14rem] md:bg-contain md:min-h-[750px] 
              lg:px-[7rem] lg:py-[14rem] lg:bg-contain lg:min-h-[750px]
              ${showTaskModal ? 'animate-slideInFromBottom' : 'animate-slideOutToBottom'}`}
        style={{
          backgroundImage: `url(/assets/images/task_panel.webp)`,
          backgroundPosition: "center",
        }}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="text-left grid w-full gap-1 pt-[1rem]
          sm:pt-0
          md:gap-4
          lg:pt-0">
          <h3 className="text-[1.5rem] lg:text-[2rem] pl-4 text-[#FFAA00]">Complete missions to earn free coins</h3>
          <div className="max-h-[320px] grid grid-cols-1 gap-3 px-4 overflow-x-hidden overflow-y-auto custom-scrollbar
            md:max-h-[200px] 
            lg:max-h-[260px]">
            {renderOneTimeTaskList}
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
