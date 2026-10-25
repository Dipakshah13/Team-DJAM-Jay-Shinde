'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { INITIAL_WORKERS } from '@/data/workers';
import { SERVICES } from '@/data/services';
import { STORAGE_KEY } from '@/lib/constants';
import { generateOtp, verifyOtp } from '@/lib/otp';
import { JOB_STATUS, canTransition } from '@/lib/jobMachine';

const getInitialState = () => ({
  currentUser: {
    phone: '+91 98201 12345',
    role: 'customer', // 'customer' | 'worker' | 'admin'
  },
  language: 'en',
  tutorialSeen: true,
  activeWorkerId: 'w1', // Ramesh Pawar
  workers: INITIAL_WORKERS,
  bookings: [
    {
      id: 'b-seed-1',
      customerId: 'c1',
      workerId: 'w1',
      serviceId: 'plumber',
      description: 'Bathroom tap washer replacement',
      landmark: 'Near Ganesh Temple, 2nd floor',
      schedule: { type: 'NOW', label: 'Instant Help (~20 min)' },
      status: JOB_STATUS.COMPLETED,
      estimate: { labour: 350, parts: 80, total: 430 },
      counter: { offered: null, response: null },
      finalPrice: 350,
      startOtp: '4821',
      endOtp: '7390',
      extras: [],
      jobCard: {
        beforePhoto: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&auto=format&fit=crop&q=80',
        afterPhoto: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80',
        checklist: [
          { id: 't1', textKey: 'proof.task1', done: true },
          { id: 't2', textKey: 'proof.task2', done: true },
          { id: 't3', textKey: 'proof.task3', done: true },
        ],
      },
      payment: {
        mode: 'CASH',
        status: 'PAID',
        paidAt: Date.now() - 86400000 * 2 + 3600000,
      },
      createdAt: Date.now() - 86400000 * 2,
      completedAt: Date.now() - 86400000 * 2 + 3600000,
      feedback: {
        rating: 5,
        tags: ['Punctual & Fast', 'Clean Work'],
        comment: 'Great plumbing job, quick and fair.',
      },
    },
  ],
  activeBookingId: null,
  complaints: [],
  workerPayouts: [
    {
      id: 'w-payout-1',
      workerId: 'w1',
      amount: 644,
      upiId: 'ramesh.pawar@okhdfcbank',
      status: 'TRANSFERRED',
      date: Date.now() - 86400000 * 3,
    },
  ],
});

export const useAppStore = create(
  persist(
    (set, get) => ({
      ...getInitialState(),

      // i18n
      setLanguage: (language) => set({ language }),

      // Auth & Role
      signIn: (phone, role = 'customer') =>
        set({
          currentUser: { phone, role },
          tutorialSeen: true,
        }),
      signOut: () => set({ currentUser: null }),
      setRole: (role) =>
        set((state) => ({
          currentUser: {
            phone: state.currentUser?.phone || '+91 98201 12345',
            role,
          },
        })),
      setTutorialSeen: (tutorialSeen) => set({ tutorialSeen }),

      // Worker management
      setActiveWorkerId: (activeWorkerId) => set({ activeWorkerId }),
      toggleWorkerOnline: (workerId) =>
        set((state) => ({
          workers: state.workers.map((w) =>
            w.id === workerId ? { ...w, online: !w.online } : w
          ),
        })),
      updateWorkerSetup: (workerId, { services, baseFare }) =>
        set((state) => ({
          workers: state.workers.map((w) =>
            w.id === workerId
              ? {
                  ...w,
                  services: services !== undefined ? services : w.services,
                  baseFare: baseFare !== undefined ? Number(baseFare) : w.baseFare,
                }
              : w
          ),
        })),
      approveWorker: (workerId) =>
        set((state) => ({
          workers: state.workers.map((w) =>
            w.id === workerId ? { ...w, approved: true } : w
          ),
        })),
      toggleWorkerVerified: (workerId, checks) =>
        set((state) => ({
          workers: state.workers.map((w) => {
            if (w.id !== workerId) return w;
            const updatedChecks = checks || {
              phone: true,
              id: !w.verified,
              skillEvidence: !w.verified,
            };
            const isVerified =
              updatedChecks.phone && updatedChecks.id && updatedChecks.skillEvidence;
            return {
              ...w,
              verified: isVerified,
              checks: updatedChecks,
            };
          }),
        })),
      vouchForWorker: (workerId) =>
        set((state) => ({
          workers: state.workers.map((w) =>
            w.id === workerId ? { ...w, vouches: (w.vouches || 0) + 1 } : w
          ),
        })),

      // Booking flow
      createBooking: ({ serviceId, description, landmark, workerId, schedule }) => {
        const worker = get().workers.find((w) => w.id === workerId);
        const service = SERVICES.find((s) => s.id === serviceId);

        const labour = worker?.baseFare || 350;
        const parts = service?.defaultParts || 100;
        const bookingId = `b-${Date.now()}`;

        const newBooking = {
          id: bookingId,
          customerId: 'c1',
          workerId,
          serviceId,
          description: description || 'General service request',
          landmark: landmark || '',
          schedule: schedule || { type: 'NOW', label: 'Instant Help (~20 min)' },
          status: JOB_STATUS.REQUESTED,
          estimate: {
            labour,
            parts,
            total: labour + parts,
          },
          counter: { offered: null, response: null },
          finalPrice: null,
          startOtp: generateOtp(),
          endOtp: generateOtp(),
          extras: [],
          jobCard: {
            beforePhoto: null,
            afterPhoto: null,
            checklist: [
              { id: 't1', textKey: 'proof.task1', done: false },
              { id: 't2', textKey: 'proof.task2', done: false },
              { id: 't3', textKey: 'proof.task3', done: false },
            ],
          },
          payment: {
            mode: 'CASH',
            status: 'PENDING',
            paidAt: null,
          },
          createdAt: Date.now(),
          feedback: null,
        };

        set((state) => ({
          bookings: [newBooking, ...state.bookings],
          activeBookingId: bookingId,
        }));

        return bookingId;
      },

      sendCounterOffer: (bookingId, offeredAmount) => {
        const amount = Number(offeredAmount);
        set((state) => ({
          bookings: state.bookings.map((b) => {
            if (b.id !== bookingId) return b;
            if (!canTransition(b.status, JOB_STATUS.COUNTERED)) return b;
            return {
              ...b,
              status: JOB_STATUS.COUNTERED,
              counter: {
                offered: amount,
                response: null,
              },
            };
          }),
        }));
      },

      workerRespondToCounter: (bookingId, accept) => {
        set((state) => ({
          bookings: state.bookings.map((b) => {
            if (b.id !== bookingId) return b;
            if (accept) {
              return {
                ...b,
                status: JOB_STATUS.CONFIRMED,
                finalPrice: b.counter?.offered || b.estimate.labour,
                counter: {
                  ...b.counter,
                  response: 'ACCEPTED',
                },
              };
            } else {
              return {
                ...b,
                counter: {
                  ...b.counter,
                  response: 'DECLINED',
                },
              };
            }
          }),
        }));
      },

      confirmBookingPrice: (bookingId, price) => {
        set((state) => ({
          bookings: state.bookings.map((b) => {
            if (b.id !== bookingId) return b;
            const finalPrice = price !== undefined ? Number(price) : b.estimate.labour;
            return {
              ...b,
              status: JOB_STATUS.CONFIRMED,
              finalPrice,
            };
          }),
        }));
      },

      workerAcceptBooking: (bookingId) => {
        set((state) => ({
          bookings: state.bookings.map((b) => {
            if (b.id !== bookingId) return b;
            return {
              ...b,
              status: JOB_STATUS.CONFIRMED,
              finalPrice: b.estimate.labour,
            };
          }),
        }));
      },

      workerDeclineBooking: (bookingId) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: JOB_STATUS.DECLINED } : b
          ),
        }));
      },

      // OTP Verification
      startJobWithOtp: (bookingId, enteredOtp) => {
        const booking = get().bookings.find((b) => b.id === bookingId);
        if (!booking) return { success: false, message: 'Booking not found' };

        if (!verifyOtp(enteredOtp, booking.startOtp)) {
          return { success: false, message: 'Invalid Start OTP' };
        }

        if (!canTransition(booking.status, JOB_STATUS.STARTED)) {
          return { success: false, message: 'Invalid state transition' };
        }

        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: JOB_STATUS.STARTED } : b
          ),
        }));

        return { success: true };
      },

      raiseExtraCharge: (bookingId, { reason, amount }) => {
        const extraId = `e-${Date.now()}`;
        const newExtra = {
          id: extraId,
          reason,
          amount: Number(amount),
          status: 'PENDING',
          createdAt: Date.now(),
        };

        set((state) => ({
          bookings: state.bookings.map((b) => {
            if (b.id !== bookingId) return b;
            return {
              ...b,
              status: JOB_STATUS.EXTRA_PENDING,
              extras: [...(b.extras || []), newExtra],
            };
          }),
        }));
      },

      respondToExtraCharge: (bookingId, extraId, approve) => {
        set((state) => ({
          bookings: state.bookings.map((b) => {
            if (b.id !== bookingId) return b;
            const updatedExtras = (b.extras || []).map((e) =>
              e.id === extraId
                ? { ...e, status: approve ? 'APPROVED' : 'DECLINED' }
                : e
            );
            return {
              ...b,
              status: JOB_STATUS.STARTED,
              extras: updatedExtras,
            };
          }),
        }));
      },

      endJobWithOtp: (bookingId, enteredOtp) => {
        const booking = get().bookings.find((b) => b.id === bookingId);
        if (!booking) return { success: false, message: 'Booking not found' };

        if (!verifyOtp(enteredOtp, booking.endOtp)) {
          return { success: false, message: 'Invalid End OTP' };
        }

        if (!canTransition(booking.status, JOB_STATUS.COMPLETED)) {
          return { success: false, message: 'Invalid state transition' };
        }

        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId
              ? {
                  ...b,
                  status: JOB_STATUS.COMPLETED,
                  completedAt: Date.now(),
                }
              : b
          ),
          // Increment completed jobs on worker
          workers: state.workers.map((w) =>
            w.id === booking.workerId
              ? { ...w, jobsDone: (w.jobsDone || 0) + 1 }
              : w
          ),
        }));

        return { success: true };
      },

      submitFeedback: (bookingId, { rating, tags, comment, blocked, reported }) => {
        const booking = get().bookings.find((b) => b.id === bookingId);
        if (!booking) return;

        set((state) => {
          const updatedBookings = state.bookings.map((b) =>
            b.id === bookingId
              ? {
                  ...b,
                  status: JOB_STATUS.RATED,
                  feedback: {
                    rating,
                    tags,
                    comment,
                    blocked,
                    reported,
                  },
                }
              : b
          );

          let updatedComplaints = state.complaints;
          if (reported) {
            updatedComplaints = [
              {
                id: `c-${Date.now()}`,
                bookingId,
                workerId: booking.workerId,
                reason: comment || 'Reported via feedback',
                status: 'OPEN',
                createdAt: Date.now(),
              },
              ...state.complaints,
            ];
          }

          return {
            bookings: updatedBookings,
            complaints: updatedComplaints,
          };
        });
      },

      fileComplaint: (bookingId, reason) => {
        const booking = get().bookings.find((b) => b.id === bookingId);
        set((state) => ({
          complaints: [
            {
              id: `c-${Date.now()}`,
              bookingId,
              workerId: booking?.workerId || 'unknown',
              reason,
              status: 'OPEN',
              createdAt: Date.now(),
            },
            ...state.complaints,
          ],
        }));
      },

      // Job Proof & Checklist actions
      updateJobProofPhoto: (bookingId, photoType, photoUrl) => {
        set((state) => ({
          bookings: state.bookings.map((b) => {
            if (b.id !== bookingId) return b;
            const currentCard = b.jobCard || {
              beforePhoto: null,
              afterPhoto: null,
              checklist: [],
            };
            return {
              ...b,
              jobCard: {
                ...currentCard,
                [photoType]: photoUrl,
              },
            };
          }),
        }));
      },

      toggleChecklistTask: (bookingId, taskId) => {
        set((state) => ({
          bookings: state.bookings.map((b) => {
            if (b.id !== bookingId) return b;
            const currentCard = b.jobCard || { checklist: [] };
            const updatedChecklist = (currentCard.checklist || []).map((t) =>
              t.id === taskId ? { ...t, done: !t.done } : t
            );
            return {
              ...b,
              jobCard: {
                ...currentCard,
                checklist: updatedChecklist,
              },
            };
          }),
        }));
      },

      // Payment actions (Cash / UPI)
      setPaymentDetails: (bookingId, { mode = 'UPI', status = 'PAID' }) => {
        set((state) => ({
          bookings: state.bookings.map((b) => {
            if (b.id !== bookingId) return b;
            return {
              ...b,
              payment: {
                mode,
                status,
                paidAt: Date.now(),
              },
            };
          }),
        }));
      },

      // Worker Wallet & Instant Withdrawal
      withdrawWorkerBalance: (workerId, amount, upiId = 'worker@upi') => {
        const payout = {
          id: `w-payout-${Date.now()}`,
          workerId,
          amount: Number(amount),
          upiId,
          status: 'TRANSFERRED',
          date: Date.now(),
        };

        set((state) => ({
          workerPayouts: [payout, ...(state.workerPayouts || [])],
        }));

        return payout;
      },

      resetState: () => {
        set(getInitialState());
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
