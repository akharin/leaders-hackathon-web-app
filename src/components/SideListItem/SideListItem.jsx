import React from 'react';
import './SideListItem.css';

const SideListItem = ({title, desc, icon, showArrowBtn, onClick}) => {
	return (
		<div className="side-list-item"
			 onClick={onClick}>
			<div className="side-list-item__avatar">
				<img className="side-list-item__avatar-icon" src={icon} alt={title}/>
			</div>

			<div className="side-list-item__info">
				<div className="side-list-item__title">
					{title}
				</div>
				<div className="side-list-item__desc">
					{desc}
				</div>
			</div>

			{showArrowBtn && (
				<div className="side-list-item__arrow-btn">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
						 xmlns="http://www.w3.org/2000/svg">
						<path fillRule="evenodd" clipRule="evenodd"
							  d="M8.29289 17.7071C7.90237 17.3166 7.90237 16.6834 8.29289 16.2929L12.5858 12L8.29289 7.70711C7.90237 7.31658 7.90237 6.68342 8.29289 6.29289C8.68342 5.90237 9.31658 5.90237 9.70711 6.29289L14.7071 11.2929C15.0976 11.6834 15.0976 12.3166 14.7071 12.7071L9.70711 17.7071C9.31658 18.0976 8.68342 18.0976 8.29289 17.7071Z"
							  fill="white"/>
					</svg>
				</div>
			)}
		</div>
	);
};

export default SideListItem;
