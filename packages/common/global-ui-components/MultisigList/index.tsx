import React from 'react';
import ParachainTooltipIcon from '@common/global-ui-components/ParachainTooltipIcon';
import Identicon from '@polkadot/react-identicon';
import { SlideInMotion } from '@common/global-ui-components/Motion/SlideIn';
import { ScaleMotion } from '@common/global-ui-components/Motion/Scale';
import { IMultisig } from '@common/types/substrate';
import { networkConstants } from '@common/constants/substrateNetworkConstant';

interface IMultisigList {
	multisigs: Array<IMultisig>;
}

const styles = {
	container: 'flex flex-col flex-1 max-h-full overflow-y-auto',
	title: 'uppercase text-text-secondary ml-3 text-xs font-primary flex items-center justify-between',
	multisigCount: 'bg-highlight text-primary rounded-full flex items-center justify-center h-5 w-5 font-normal text-xs',
	listContainer: 'overflow-y-auto max-h-full my-3 overflow-x-hidden',
	list: 'flex flex-col text-white list-none',
	listItem: 'w-full',
	button: 'w-full flex items-center gap-x-2 flex-1 rounded-lg p-3 font-medium text-[13px] max-sm:p-1',
	identicon: 'image identicon mt-1',
	relative: 'relative',
	networkIcon: 'absolute -top-0.5 right-0',
	truncate: 'truncate'
};

function MultisigList({ multisigs }: IMultisigList) {
	return (
		<div className={styles.container}>
			<h2 className={styles.title}>
				<span>Multisigs</span>
				<span className={styles.multisigCount}>{multisigs ? multisigs.length : '0'}</span>
			</h2>
			<section className={styles.listContainer}>
				<SlideInMotion>
					{multisigs && (
						<ul className={styles.list}>
							{multisigs.map((multisig, i) => {
								return (
									<ScaleMotion key={`${multisig.address}_${multisig.network}_${i}`}>
										<li className={styles.listItem}>
											<button
												className={styles.button}
												onClick={() => {}}
											>
												<div className={styles.relative}>
													<Identicon
														className={styles.identicon}
														value={multisig.address}
														size={25}
														theme='polkadot'
													/>
													<div className={styles.networkIcon}>
														<ParachainTooltipIcon
															size={10}
															src={networkConstants[multisig.network]?.logo}
														/>
													</div>
												</div>
												<span className={styles.truncate}>{multisig.name}</span>
											</button>
										</li>
									</ScaleMotion>
								);
							})}
						</ul>
					)}
				</SlideInMotion>
			</section>
		</div>
	);
}

export default MultisigList;
