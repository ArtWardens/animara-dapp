import React, { useState } from 'react';

const TasksCheck = () => {

    const [isChecked, setIsChecked] = useState({
        boosts: false,
        upgrades: false,
        tasks: false
    });

    const tasks = {
        daily: [
            {
                id: '1',
                type: 'energy',
                task: 'Energy Refresh',
                color: 'purple',
                count: '3/3',
                description: 'available today',
                path1: 'M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5ZM3.75 18h15A2.25 2.25 0 0 0 21 15.75v-6a2.25 2.25 0 0 0-2.25-2.25h-15A2.25 2.25 0 0 0 1.5 9.75v6A2.25 2.25 0 0 0 3.75 18Z',
            },
            {
                id: '2',
                type: 'invite',
                task: 'Invite Friend',
                color: 'red',
                count: '+5000',
                description: 'for you and your friend',
                path1: 'M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z',
            },
        ],
        booster: [
            {
                id: '1',
                type: 'multitap',
                title: 'Multitap',
                count: '1',
                point: '2.04M',
                level: '12'
            },
            {
                id: '2',
                type: 'cap',
                title: 'Energy Cap',
                count: '500',
                point: '2.03M',
                level: '12'
            },
        ]
    }

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCheckbox, setSelectedCheckbox] = useState(null);

    const handleCheckboxChange = (checkbox) => {
        setIsChecked((prevState) => ({
            ...prevState,
            [checkbox]: !prevState[checkbox],
        }));
        setSelectedCheckbox(checkbox);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedCheckbox(null);
    };

    const Checkbox = ({ label, checkbox }) => (
        <div>
            <label className='flex items-center cursor-pointer text-3xl select-none text-dark dark:text-white'>
                <div className='relative'>
                    <input
                        type='checkbox'
                        checked={isChecked[checkbox]}
                        onChange={() => handleCheckboxChange(checkbox)}
                        className='sr-only'
                    />
                    <div className='box mr-4 flex h-8 w-8 items-center justify-center rounded border-stroke dark:border-dark-3'>
                        <span className={isChecked[checkbox] ? 'opacity-100' : 'opacity-0'}>
                            <svg
                                width='24'
                                height='24'
                                viewBox='0 0 11 8'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z'
                                    fill='#3056D3'
                                    stroke='#3056D3'
                                    strokeWidth='0.4'
                                ></path>
                            </svg>
                        </span>
                    </div>
                </div>
                {label}
            </label>
        </div>
    );

    return (
        <div className="absolute mx-auto bottom-5 z-12 right-4 md:right-20 lg:right-30 xl:right-40 2xl:right-80">
            <Checkbox label="BOOSTS" checkbox="boosts" />
            <Checkbox label="Upgrades" checkbox="upgrades" />
            <Checkbox label="Tasks" checkbox="tasks" />

            {modalOpen && selectedCheckbox && (
                <div
                    className="fixed left-0 top-0 flex h-full min-h-screen w-full items-center justify-center bg-dark/90 px-4 py-4"
                    style={{
                        zIndex: 100, // Add a high z-index here
                    }}
                >
                    <div className="w-full max-w-[900px] rounded-[20px] bg-white px-5 py-8 text-center dark:bg-dark-2 md:px-[48px] md:py-[48px]">
                        <ul class="grid w-full gap-4 mb-8">
                            <div className='flex flex-row justify-between items-center'>
                                <h3 className='text-3xl'>
                                    Free Daily Boosters
                                </h3>
                                <a className='text-4xl mx-3' type="button" onClick={closeModal}>&times;</a>
                            </div>
                            {tasks.daily.map((task) => (
                                <li>
                                    <input type="checkbox" id={`${task.type}-${task.id}`} value="" class="hidden peer" />
                                    <label for={`${task.type}-${task.id}`} className="inline-flex items-center justify-between w-full p-2 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-4 peer-checked:border-sky-900 hover:text-gray-600 dark:peer-checked:text-gray-500 peer-checked:text-gray-600 peer-checked:bg-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                        <div className='flex flex-1 items-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`ml-4 md:ml-6 w-10 h-10 text-${task.color}-500`}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d={`${task.path1}`} />
                                            </svg>
                                            <div class="ml-10 w-full text-2xl text-left">
                                                {task.task}
                                                <div class="w-full text-lg">
                                                    <span class={`text-${task.color}-500 text-xl`}>{task.count} &nbsp;</span>{task.description}
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                </li>
                            ))}
                        </ul>

                        <ul class="grid w-full gap-4 mb-4">
                            <li className='flex flex-1 items-center'>
                                <h3 className='text-4xl text-left'>
                                    Boosters
                                </h3>
                            </li>
                            {tasks.booster.map((task) => (
                                <li>
                                    <input type="checkbox" id={`${task.type}-${task.id}`} value="" class="hidden peer" checked />
                                    <label for={`${task.type}-${task.id}`} className="inline-flex items-center justify-between w-full p-2 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-4 peer-checked:border-sky-900 hover:text-gray-600 dark:peer-checked:text-gray-500 peer-checked:text-gray-600 peer-checked:bg-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                        <div class="flex flex-1 items-center">
                                            <svg class="ml-4 md:ml-8 w-14 h-14 text-sky-500" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M418.2 177.2c-5.4-1.8-10.8-3.5-16.2-5.1.9-3.7 1.7-7.4 2.5-11.1 12.3-59.6 4.2-107.5-23.1-123.3-26.3-15.1-69.2.6-112.6 38.4-4.3 3.7-8.5 7.6-12.5 11.5-2.7-2.6-5.5-5.2-8.3-7.7-45.5-40.4-91.1-57.4-118.4-41.5-26.2 15.2-34 60.3-23 116.7 1.1 5.6 2.3 11.1 3.7 16.7-6.4 1.8-12.7 3.8-18.6 5.9C38.3 196.2 0 225.4 0 255.6c0 31.2 40.8 62.5 96.3 81.5 4.5 1.5 9 3 13.6 4.3-1.5 6-2.8 11.9-4 18-10.5 55.5-2.3 99.5 23.9 114.6 27 15.6 72.4-.4 116.6-39.1 3.5-3.1 7-6.3 10.5-9.7 4.4 4.3 9 8.4 13.6 12.4 42.8 36.8 85.1 51.7 111.2 36.6 27-15.6 35.8-62.9 24.4-120.5-.9-4.4-1.9-8.9-3-13.5 3.2-.9 6.3-1.9 9.4-2.9 57.7-19.1 99.5-50 99.5-81.7 0-30.3-39.4-59.7-93.8-78.4zM282.9 92.3c37.2-32.4 71.9-45.1 87.7-36 16.9 9.7 23.4 48.9 12.8 100.4-.7 3.4-1.4 6.7-2.3 10-22.2-5-44.7-8.6-67.3-10.6-13-18.6-27.2-36.4-42.6-53.1 3.9-3.7 7.7-7.2 11.7-10.7zM167.2 307.5c5.1 8.7 10.3 17.4 15.8 25.9-15.6-1.7-31.1-4.2-46.4-7.5 4.4-14.4 9.9-29.3 16.3-44.5 4.6 8.8 9.3 17.5 14.3 26.1zm-30.3-120.3c14.4-3.2 29.7-5.8 45.6-7.8-5.3 8.3-10.5 16.8-15.4 25.4-4.9 8.5-9.7 17.2-14.2 26-6.3-14.9-11.6-29.5-16-43.6zm27.4 68.9c6.6-13.8 13.8-27.3 21.4-40.6s15.8-26.2 24.4-38.9c15-1.1 30.3-1.7 45.9-1.7s31 .6 45.9 1.7c8.5 12.6 16.6 25.5 24.3 38.7s14.9 26.7 21.7 40.4c-6.7 13.8-13.9 27.4-21.6 40.8-7.6 13.3-15.7 26.2-24.2 39-14.9 1.1-30.4 1.6-46.1 1.6s-30.9-.5-45.6-1.4c-8.7-12.7-16.9-25.7-24.6-39s-14.8-26.8-21.5-40.6zm180.6 51.2c5.1-8.8 9.9-17.7 14.6-26.7 6.4 14.5 12 29.2 16.9 44.3-15.5 3.5-31.2 6.2-47 8 5.4-8.4 10.5-17 15.5-25.6zm14.4-76.5c-4.7-8.8-9.5-17.6-14.5-26.2-4.9-8.5-10-16.9-15.3-25.2 16.1 2 31.5 4.7 45.9 8-4.6 14.8-10 29.2-16.1 43.4zM256.2 118.3c10.5 11.4 20.4 23.4 29.6 35.8-19.8-.9-39.7-.9-59.5 0 9.8-12.9 19.9-24.9 29.9-35.8zM140.2 57c16.8-9.8 54.1 4.2 93.4 39 2.5 2.2 5 4.6 7.6 7-15.5 16.7-29.8 34.5-42.9 53.1-22.6 2-45 5.5-67.2 10.4-1.3-5.1-2.4-10.3-3.5-15.5-9.4-48.4-3.2-84.9 12.6-94zm-24.5 263.6c-4.2-1.2-8.3-2.5-12.4-3.9-21.3-6.7-45.5-17.3-63-31.2-10.1-7-16.9-17.8-18.8-29.9 0-18.3 31.6-41.7 77.2-57.6 5.7-2 11.5-3.8 17.3-5.5 6.8 21.7 15 43 24.5 63.6-9.6 20.9-17.9 42.5-24.8 64.5zm116.6 98c-16.5 15.1-35.6 27.1-56.4 35.3-11.1 5.3-23.9 5.8-35.3 1.3-15.9-9.2-22.5-44.5-13.5-92 1.1-5.6 2.3-11.2 3.7-16.7 22.4 4.8 45 8.1 67.9 9.8 13.2 18.7 27.7 36.6 43.2 53.4-3.2 3.1-6.4 6.1-9.6 8.9zm24.5-24.3c-10.2-11-20.4-23.2-30.3-36.3 9.6.4 19.5.6 29.5.6 10.3 0 20.4-.2 30.4-.7-9.2 12.7-19.1 24.8-29.6 36.4zm130.7 30c-.9 12.2-6.9 23.6-16.5 31.3-15.9 9.2-49.8-2.8-86.4-34.2-4.2-3.6-8.4-7.5-12.7-11.5 15.3-16.9 29.4-34.8 42.2-53.6 22.9-1.9 45.7-5.4 68.2-10.5 1 4.1 1.9 8.2 2.7 12.2 4.9 21.6 5.7 44.1 2.5 66.3zm18.2-107.5c-2.8.9-5.6 1.8-8.5 2.6-7-21.8-15.6-43.1-25.5-63.8 9.6-20.4 17.7-41.4 24.5-62.9 5.2 1.5 10.2 3.1 15 4.7 46.6 16 79.3 39.8 79.3 58 0 19.6-34.9 44.9-84.8 61.4zm-149.7-15c25.3 0 45.8-20.5 45.8-45.8s-20.5-45.8-45.8-45.8c-25.3 0-45.8 20.5-45.8 45.8s20.5 45.8 45.8 45.8z" /></svg>
                                            <div class="w-full text-2xl text-left ml-8">{task.title} &nbsp;+{task.count}</div>
                                            <div className="w-full text-xl flex items-center justify-end mr-4 ml-auto">
                                                <img className="h-6 w-6" src="../assets/images/clicker-character/gem.png" alt="Gem" />
                                                &nbsp;{task.point} &nbsp; | &nbsp;
                                                <span className="text-sky-500">LV{task.level}</span>
                                            </div>
                                        </div>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TasksCheck;
