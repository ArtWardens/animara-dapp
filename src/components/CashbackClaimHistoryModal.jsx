import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { useAppDispatch } from '../hooks/storeHooks';
import {
  getCashbackClaimHistory,
  useCashbackClaimHistoryDetails,
  useCashbackClaimHistoryLoading,
  useCashbackClaimHistoryLoadSuccess,
} from '../sagaStore/slices';

const CashbackClaimHistoryModal = ({ setShowClaimHistory }) => {
  const dispatch = useAppDispatch();

  const cashbackClaimHistory = useCashbackClaimHistoryDetails();
  const cashbackClaimHistoryLoading = useCashbackClaimHistoryLoading();
  const cashbackClaimHistoryLoaded = useCashbackClaimHistoryLoadSuccess();

//   const mockData = [
//     {
//       data: {
//         tx_id: 'sample_txid_1',
//         wallet_address: 'sample_wallet_address_1',
//         created_at: '2024-09-20T10:25:21.000Z',
//         amount: 12.3456,
//         status: 'completed',
//       },
//     },
//     {
//       data: {
//         tx_id: 'sample_txid_2',
//         wallet_address: 'sample_wallet_address_2',
//         created_at: '2024-09-21T15:45:11.000Z',
//         amount: 10.9876,
//         status: 'pending',
//       },
//     },
//     {
//         data: {
//           tx_id: 'sample_txid_3',
//           wallet_address: 'sample_wallet_address_1',
//           created_at: '2024-09-20T10:25:21.000Z',
//           amount: 12.3456,
//           status: 'completed',
//         },
//       },
//       {
//         data: {
//           tx_id: 'sample_txid_4',
//           wallet_address: 'sample_wallet_address_2',
//           created_at: '2024-09-21T15:45:11.000Z',
//           amount: 10.9876,
//           status: 'pending',
//         },
//       },
//       {
//         data: {
//           tx_id: 'sample_txid_5',
//           wallet_address: 'sample_wallet_address_1',
//           created_at: '2024-09-20T10:25:21.000Z',
//           amount: 12.3456,
//           status: 'completed',
//         },
//       },
//       {
//         data: {
//           tx_id: 'sample_txid_6',
//           wallet_address: 'sample_wallet_address_2',
//           created_at: '2024-09-21T15:45:11.000Z',
//           amount: 10.9876,
//           status: 'pending',
//         },
//       },
//       {
//         data: {
//           tx_id: 'sample_txid_7',
//           wallet_address: 'sample_wallet_address_1',
//           created_at: '2024-09-20T10:25:21.000Z',
//           amount: 12.3456,
//           status: 'completed',
//         },
//       },
//       {
//         data: {
//           tx_id: 'sample_txid_8',
//           wallet_address: 'sample_wallet_address_2',
//           created_at: '2024-09-21T15:45:11.000Z',
//           amount: 10.9876,
//           status: 'pending',
//         },
//       },
//       {
//         data: {
//           tx_id: 'sample_txid_9',
//           wallet_address: 'sample_wallet_address_1',
//           created_at: '2024-09-20T10:25:21.000Z',
//           amount: 12.3456,
//           status: 'completed',
//         },
//       },
//       {
//         data: {
//           tx_id: 'sample_txid_10',
//           wallet_address: 'sample_wallet_address_2',
//           created_at: '2024-09-21T15:45:11.000Z',
//           amount: 10.9876,
//           status: 'pending',
//         },
//       },
//       {
//         data: {
//           tx_id: 'sample_txid_11',
//           wallet_address: 'sample_wallet_address_1',
//           created_at: '2024-09-20T10:25:21.000Z',
//           amount: 12.3456,
//           status: 'completed',
//         },
//       },
//       {
//         data: {
//           tx_id: 'sample_txid_12',
//           wallet_address: 'sample_wallet_address_2',
//           created_at: '2024-09-21T15:45:11.000Z',
//           amount: 10.9876,
//           status: 'pending',
//         },
//       },
//   ];

  const getItemsPerPage = () => {
    if (window.innerWidth >= 768) { // md breakpoint (768px)
      return 10; // For medium and larger screens
    } else {
      return 4; // For smaller screens
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(getItemsPerPage());
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = cashbackClaimHistory?.data?.cashbackClaimsArchiveData?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cashbackClaimHistory?.data?.cashbackClaimsArchiveData?.length / itemsPerPage);
// MOCK TEST DATA
// const currentData = mockData?.slice(indexOfFirstItem, indexOfLastItem);
// const totalPages = Math.ceil(mockData.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    dispatch(getCashbackClaimHistory());
    console.log(currentData);
  }, [dispatch]);

  return (
    <div
      className={`fixed z-[100] inset-0 w-screen h-screen flex items-center justify-center bg-black/50 backdrop-blur-lg transition-all duration-300 
        ${window.innerHeight < 800 ? (window.innerWidth > 500 ? '' : 'flex-col') : `flex-col`}`}
    >
        {cashbackClaimHistoryLoading || !cashbackClaimHistoryLoaded ? (
            // loader
            <div className="w-full pt-4 flex align-middle justify-center">
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
            </div>
        ) : (
            cashbackClaimHistory?.data?.cashbackClaimsArchiveData &&
            cashbackClaimHistory?.data?.cashbackClaimsArchiveData.length > 0 ? (
            <>
                {/* Desktop wallet panel */}
                <div
                    className="max-w-[1200px] w-[95%] h-full hidden lg:block my-auto p-[1rem] lg:px-[6rem] lg:py-[11rem] xl:p-[9rem] rounded-2xl text-white text-center bg-contain"
                    style={{
                        backgroundImage: `url("/assets/images/claim_history_bg.webp")`,
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    {/* Close button */}
                    <button
                        className="relative top-[5%] left-[50%] xl:left-[55%] p-2 hover:brightness-75"
                        onClick={() => setShowClaimHistory(false)}
                    >
                    X
                    </button>
                    {/* Title */}
                    <p className='text-left font-LuckiestGuy text-2xl text-[#FFAA00] px-4 py-2 mt-4'>claim history</p>
                    {/* data */}
                    <div className='w-full overflow-x-auto font-outfit'>
                        <table className='w-full table-fixed'>
                        <thead className='bg-[#040404]'>
                            <tr>
                                <th className='w-[20%] px-4 py-2 text-left'>TXID</th>
                                <th className='w-[20%] px-4 py-2 text-left'>Wallet Address</th>
                                <th className='w-[25%] px-4 py-2 text-left'>Date & Time</th>
                                <th className='w-[15%] px-4 py-2 text-left'>SOL Claims</th>
                                <th className='w-[20%] px-4 py-2 text-left'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((item) => (
                            <tr key={item.data.tx_id} className='border border-t-0 border-x-0 border-b-gray-500'>
                                <td className='truncate px-4 py-2 text-left'>{item.data.tx_id}</td>
                                <td className='truncate px-4 py-2 text-left'>{item.data.wallet_address}</td>
                                <td className='truncate px-4 py-2 text-left'>{new Date(item.data.created_at).toLocaleString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false
                                })}</td>
                                <td className='truncate px-4 py-2 text-left'>{Number(item.data.amount).toFixed(4)}</td>
                                <td className={`truncate px-4 py-2 text-left capitalize ${item.data.status === 'completed' ? 'text-[#ADFF44]' : 'text-[#FF4444]'}`}>
                                    <span className={`h-2 w-2 rounded-full inline-block mr-2 ${item.data.status === 'completed' ? 'bg-[#ADFF44]' : 'bg-[#FF4444]'}`}></span>
                                    {item.data.status}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                        {/* Pagination buttons */}
                        <div className='flex mt-4'>
                            <button onClick={handlePrevPage} disabled={currentPage === 1}
                                className='max-w-28 hover:brightness-75'
                            >
                                Previous
                            </button>
                            <p className='grow'>
                                Page {currentPage} of {totalPages}
                            </p>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages}
                                className='max-w-28 hover:brightness-75'
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile wallet panel */}
                <div
                    className={`max-w-[95%] w-full max-h-[95%] pb-[2rem] px-[3.25rem] lg:hidden rounded-2xl text-white text-center bg-contain
                        ${window.innerHeight < 800 ? 'py-[1rem] max-w-[350px]' : 'max-w-[350px] px-[1rem] xs:py-[2rem]'}`}
                    style={{
                        backgroundImage: `url("/assets/images/mb_claim_history_bg.webp")`,
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    {/* Close button */}
                    <button
                        className="relative top-[2%] left-[45%] xs:left-[50%] xl:left-[55%] p-2 hover:brightness-75"
                        onClick={() => setShowClaimHistory(false)}
                    >
                    X
                    </button>
                    {/* Title */}
                    <p className='font-LuckiestGuy text-2xl text-[#FFAA00] px-4 py-2'>claim history</p>
                    {/* data */}
                    {currentData.map((item) => (
                    <div className='border border-t-0 border-x-0 border-b-gray-500 font-outfit'>
                        <p className='truncate px-4 pt-1 text-left text-[#C5C5C5] text-[14px]'>{new Date(item.data.created_at).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: false
                        })}</p>
                        <div className='flex'>
                            <p className='grow truncate px-4 text-left text-[#FFC85A] text-2xl font-bold'>{Number(item.data.amount).toFixed(4)}</p>
                            <span className={`h-2 w-2 rounded-full inline-block my-auto mr-2 ${item.data.status === 'completed' ? 'bg-[#ADFF44]' : 'bg-[#FF4444]'}`}></span>
                        </div>
                        <div className='flex'>
                            <p className='basis-1/2 truncate px-4 text-left text-[#C5C5C5] text-[14px]'>TXID</p>
                            <p className='basis-1/2 truncate px-4 text-left text-[14px]'>{item.data.tx_id}</p>
                        </div>
                        <div className='flex'>
                            <p className='basis-1/2 truncate px-4 pb-1 text-left text-[#C5C5C5] text-[14px]'>Wallet Address</p>
                            <p className='basis-1/2 truncate px-4 pb-1 text-left text-[14px]'>{item.data.wallet_address}</p>
                        </div>
                    </div>
                    ))}
                    {/* Pagination buttons */}
                    <div className='flex mt-4'>
                        <button onClick={handlePrevPage} disabled={currentPage === 1}
                            className='max-w-28 hover:brightness-75'
                        >
                            Previous
                        </button>
                        <p className='grow'>
                            Page {currentPage} of {totalPages}
                        </p>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages}
                            className='max-w-28 hover:brightness-75'
                        >
                            Next
                        </button>
                    </div>
                </div>
            </>
            ) : (
                // Fallback if history is empty
                <>
                    {/* Desktop wallet panel */}
                    <div
                        className="max-w-[1200px] w-[95%] h-full hidden lg:block my-auto p-[1rem] lg:px-[6rem] lg:py-[11rem] xl:p-[10rem] rounded-2xl text-white text-center bg-contain"
                        style={{
                            backgroundImage: `url("/assets/images/claim_history_bg.webp")`,
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        {/* Close button */}
                        <button
                            className="relative top-[5%] left-[50%] xl:left-[55%] p-2 hover:brightness-75"
                            onClick={() => setShowClaimHistory(false)}
                        >
                        X
                        </button>
                        <p className='font-LuckiestGuy text-2xl text-[#FFAA00]'>No claim history available</p>
                    </div>

                    {/* Mobile wallet panel */}
                    <div
                        className={`max-w-[95%] w-full max-h-[95%] min-h-[600px] pb-[2rem] px-[3.25rem] lg:hidden rounded-2xl text-white text-center bg-contain
                            ${window.innerHeight < 800 ? 'py-[1rem] max-w-[350px]' : 'max-w-[350px] px-[1rem] xs:py-[2rem]'}`}
                        style={{
                            backgroundImage: `url("/assets/images/mb_claim_history_bg.webp")`,
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        {/* Close button */}
                        <button
                            className="relative top-[2%] left-[45%] xs:left-[50%] xl:left-[55%] p-2 hover:brightness-75"
                            onClick={() => setShowClaimHistory(false)}
                        >
                        X
                        </button>
                        <p className='font-LuckiestGuy text-2xl text-[#FFAA00] mt-2'>No claim history available</p>
                    </div>
                </>
            )
        )}
    </div>
  );
};

CashbackClaimHistoryModal.propTypes = {
  setShowClaimHistory: PropTypes.func,
};

export default CashbackClaimHistoryModal;
