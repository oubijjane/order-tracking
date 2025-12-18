import StatusCard from "./StatusCard";

function StatusList({ statusData = [] }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0' }}>
            {statusData.map(item => (
                <StatusCard key={item.value} status={item.label} />
            ))}
        </div>
    );
}

export default StatusList;