﻿(function () {
    class NavController {
        constructor ($scope, $window, $state, stateTree, $location) {
            const $$window = $($window);
            const scrollCallback = () => {
                const newHasShadow = $$window.scrollTop() > 0;
                if (this.hasShadow !== newHasShadow) {
                    $scope.$apply(() => {
                        this.hasShadow = newHasShadow;
                    });
                }
            };
            $$window.scroll(scrollCallback);

            const cancelListenRoute = $scope.$on('$destroy', () => {
                $$window.unbind('scroll', scrollCallback);
                cancelListenRoute();
            });

            $scope.stateTree = stateTree;

            const currentStateName = $state.current.name;
            if (currentStateName.substr(0, 8) === 'entrance') {
                this.inEntrance = true;
                this.tabArray = [
                    { state:'.discovery',name:'广场' },
                    { state:'.points',name:'据点' },
                    { state:'.timeline',name:'轨道' },
                ];
                $scope.$watch(() => {
                    return $state.current.name;
                }, () => {
                    const subState = $state.current.name.substr(9);
                    switch (subState) {
                        case 'discovery' :
                            this.currentPage = 0;
                            break;
                        case 'points' :
                            this.currentPage = 1;
                            break;
                        case 'timeline' :
                            this.currentPage = 2;
                            break;
                    }
                });
            } else if (currentStateName.substr(0, 17) === 'aggregation.point') {
                this.inPoint = true;
                if (stateTree.aggregation.point.basicInfo.type === 'game' || stateTree.aggregation.point.basicInfo.type === 'hardware') {
                    this.tabArray = [
                        { state: '.frontpage', name: '扉页' },
                        { state: '.intel', name: '情报' },
                        { state: '.timeline', name: '轨道' },
                        { state: '.edit', name: '编辑', 'float': 'right' },
                    ];
                } else {
                    this.tabArray = [
                        { state: '.frontpage', name: '扉页' },
                        { state: '.product', name: '作品' },
                        { state: '.timeline', name: '轨道' },
                        { state: '.edit', name: '编辑', 'float': 'right' },
                    ];
                }
                $scope.$watch(() => {
                    return $state.current.name;
                }, () => {
                    const subState = $state.current.name.substr(18);
                    switch (subState) {
                        case 'frontpage' :
                            this.currentPage = 0;
                            break;
                        case 'intel' :
                            this.currentPage = 1;
                            break;
                        case 'edit' :
                        case 'edit.info' :
                        case 'edit.style' :
                            this.currentPage = 3;
                            break;
                    }
                });
            } else if (currentStateName.substr(0, 16) === 'aggregation.user') {
                this.inUser = true;
                this.tabArray = [
                    { state: '.dossier', name: '档案' },
                    { state: '.people', name: '人脉' },
                    { state: '.timeline', name: '轨道' },
                    { state: '.edit', name: '编辑', 'float': 'right' },
                ];
                $scope.$watch(() => {
                    return $state.current.name;
                }, () => {
                    const subState = $state.current.name.substr(17);
                    switch (subState) {
                        case 'dossier' :
                            this.currentPage = 0;
                            break;
                        case 'people' :
                            this.currentPage = 1;
                            break;
                        case 'edit' :
                        case 'edit.info' :
                        case 'edit.preference' :
                            this.currentPage = 3;
                            break;
                    }
                });
            } else if (currentStateName.substr(0, 7) === 'content') {
                this.inPoint = true;
                let name;
                if (currentStateName.substr(8, 15) === 'article') {
                    name = '文章';
                } else if (currentStateName.substr(8, 16) === 'activity') {
                    name = '动态';
                }

                this.tabArray = [
                    { name, 'float': 'left', href: $location.url() },
                ];
                this.currentPage = 0;
                $scope.$watch('stateTree.content.article.pointBasicInfo', newValue => {
                    if (newValue && newValue.idCode) {
                        if (newValue.type === 'game' || newValue.type === 'hardware') {
                            this.tabArray = this.tabArray.concat([
                                { href: `point/${newValue.idCode}/frontpage`, name: '扉页' },
                                { href: `point/${newValue.idCode}/intel`, name: '情报' },
                                { href: `point/${newValue.idCode}/timeline`, name: '轨道' },
                                { href: `point/${newValue.idCode}/edit`, name: '编辑', 'float': 'right' },
                            ]);
                        } else {
                            this.tabArray = this.tabArray.concat([
                                { href: `point/${newValue.idCode}/frontpage`, name: '扉页' },
                                { href: `point/${newValue.idCode}/product`, name: '作品' },
                                { href: `point/${newValue.idCode}/timeline`, name: '轨道' },
                                { href: `point/${newValue.idCode}/edit`, name: '编辑', 'float': 'right' },
                            ]);
                        }
                    }
                });
            } else if (currentStateName.substr(0,10) === 'postOffice') {
                this.inEntrance = true;
                this.tabArray = [
                    { state: '.socialActivity',name:'社交' },
                    { state: '.missive',name:'公函' },
                ];
                $scope.$watch(() => {
                    return $state.current.name;
                }, () => {
                    const subState = $state.current.name.substr(11);
                    switch (subState) {
                        case 'socialActivity' :
                            this.currentPage = 0;
                            break;
                        case 'missive' :
                            this.currentPage = 1;
                            break;
                    }
                });
            }
        }
    }

    keylolApp.component('nav', {
        templateUrl: 'src/sections/nav.html',
        controller: NavController,
        controllerAs: 'nav',
        bindings: {
            theme: '<',
        },
    });
}());
