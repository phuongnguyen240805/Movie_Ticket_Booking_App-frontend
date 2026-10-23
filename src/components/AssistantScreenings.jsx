import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchShow } from '@/services/showService';
import { routesConfig } from '@/configs';

export default function AssistantScreenings({ movieId, onNavigate }) {
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [attempt, setAttempt] = useState(0);
    useEffect(() => {
        let active = true;
        setResult(null); setError('');
        fetchShow(movieId).then(data => {
            if (!data?.success || !data.movie) throw new Error(data?.message || 'Không tải được lịch chiếu.');
            if (active) setResult(data.dateTime || {});
        }).catch(error => { if (active) setError(error.message); });
        return () => { active = false; };
    }, [movieId, attempt]);
    if (error) return <div role="alert" className="text-xs mt-3"><p>{error}</p><button onClick={() => setAttempt(value => value + 1)} className="text-primary mt-2">Thử lại lịch chiếu</button></div>;
    if (!result) return <p role="status" className="text-xs text-gray-400 mt-3">Đang tải lịch chiếu thật từ rạp…</p>;
    const dates = Object.entries(result).filter(([, times]) => Array.isArray(times) && times.length).sort(([a], [b]) => a.localeCompare(b));
    if (!dates.length) return <p className="text-xs text-gray-400 mt-3">Hiện chưa có suất chiếu.</p>;
    return <div className="mt-3 space-y-2 max-h-44 overflow-y-auto">
        <p className="text-[11px] text-gray-400">Giờ Việt Nam (UTC+7) · Chọn ngày để đặt vé</p>
        {dates.map(([date, times]) => <Link key={date} onClick={onNavigate} to={routesConfig.seatLayoutPageGenerator(movieId, date)} className="block border border-primary/25 rounded-lg p-2 hover:bg-primary/10">
            <p className="text-xs text-primary">{new Date(times[0].time).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' })} → Đặt vé</p>
            <p className="text-xs text-gray-300 mt-1">{times.map(show => new Date(show.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' })).join(' · ')}</p>
        </Link>)}
    </div>;
}
