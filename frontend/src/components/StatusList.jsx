import StatusCard from "./StatusCard";

function StatusList({ statusData = [], counts = {} }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0' }}>
            {statusData.map(item => (
                <StatusCard key={item.value} status={item.value} count={counts[item.value]} />
            ))}
        </div>
    );
}

export default StatusList;