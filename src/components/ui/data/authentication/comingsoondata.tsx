import { FC, useEffect, useMemo, useState } from 'react';

const countDownTarget = new Date();
countDownTarget.setDate(countDownTarget.getDate() + 30);
countDownTarget.setHours(0, 0, 0, 0);

const getTimeLeft = (target: Date) => {
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

export const DayCounter: FC = () => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(countDownTarget));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(getTimeLeft(countDownTarget));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const counters = useMemo(
    () => [
      { label: 'DAYS', value: timeLeft.days },
      { label: 'HOURS', value: timeLeft.hours },
      { label: 'MINUTES', value: timeLeft.minutes },
      { label: 'SECONDS', value: timeLeft.seconds },
    ],
    [timeLeft],
  );

  return (
    <div className="countdown-grid grid gap-3 sm:grid-cols-4">
      {counters.map((counter) => (
        <div key={counter.label} className="countdown-item text-center rounded-md bg-light p-3">
          <div className="font-bold text-[1.6rem] text-defaulttextcolor">{String(counter.value).padStart(2, '0')}</div>
          <div className="text-[0.7rem] uppercase tracking-[0.2em] text-muted">{counter.label}</div>
        </div>
      ))}
    </div>
  );
};
