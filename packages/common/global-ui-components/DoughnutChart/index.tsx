/* eslint-disable no-bitwise */
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend as ChartLegend } from 'chart.js';
import Typography, { ETypographyVariants } from '@common/global-ui-components/Typography';

type IChartData = {
	label: string;
	color: string;
	value: number;
};

Chart.register(ArcElement, Tooltip, ChartLegend);

// Main DoughnutChart component
const DoughnutChart = ({ data: currentData }: { data: Array<{ label: string; value: number; color: string }> }) => {
	if (!currentData || currentData.length === 0) {
		return null;
	}

	const data = currentData.filter((item) => Boolean(item) && item?.label && item?.color && item?.value);

	const chartData = {
		labels: data.map((item) => item.label),
		datasets: [
			{
				data: data.map((item) => Number(item.value)),
				backgroundColor: data.map((item) => item.color),
				borderColor: '#1b2028',
				borderWidth: 6,
				hoverBorderColor: '#1b2028',
				hoverOffset: 4
			}
		]
	};

	const options = {
		plugins: {
			legend: {
				display: false
			},
			customSegmentWidthPlugin: {}
		},
		cutout: '70%',
		responsive: true,
		maintainAspectRatio: false
	};

	return (
		<div className='w-48 h-48'>
			<Doughnut
				data={chartData}
				options={options}
			/>
		</div>
	);
};

// Legend component
const Legend = ({ data: currentData }: { data: Array<IChartData> }) => {
	const data = currentData.filter((item) => Boolean(item) && item?.label && item?.color && item?.value);
	return (
		<div>
			<Typography
				variant={ETypographyVariants.p}
				className='text-sm text-text-secondary capitalize mb-1'
			>
				Top Assets
			</Typography>
			<div className='overflow-y-auto overflow-x-hidden h-32 px-4'>
				<ul style={{ listStyleType: 'none', padding: 0 }}>
					{data.map((item, index) => (
						<li
							key={`${item.label}_${index}`}
							style={{ color: item.color }}
						>
							<div className='flex items-center gap-2 text-xs'>
								<Typography
									variant={ETypographyVariants.p}
									className='text-xs font-medium text-text-primary capitalize'
								>
									{item.label}
								</Typography>
								<span className='text-success'>{item.value}%</span>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

// Combined component
const DoughnutChartWithLegend = ({
	data
}: {
	data: Array<{
		label: string;
		value: number;
		color: string;
	} | null>;
}) => {
	return (
		<div className='bg-bg-main flex justify-center items-center px-7 py-5 rounded-3xl gap-10'>
			{data.filter((item) => Boolean(item) && item?.label && item?.color && item?.value).length > 0 ? (
				<>
					<DoughnutChart data={data as any} />
					<Legend data={data as any} />
				</>
			) : (
				<Typography
					variant={ETypographyVariants.p}
					className='text-text-primary'
				>
					Loading...
				</Typography>
			)}
		</div>
	);
};

export default DoughnutChartWithLegend;
