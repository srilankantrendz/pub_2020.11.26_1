Vue.component('v-select', VueSelect.VueSelect);
var itemInfo = new Vue({
    el: '#itemInfo',
    data: {
        selectedGroup: '',
        selectedBin: '',
        selectedUnit: '',
        groups: [],
        bins: [],
        uoms: [],
        itemCode: '',
        price: null,
        discription: '',
        selectedExpiry: null,
        currentDate: new Date().toISOString().slice(0, 10),
        status: new Boolean(true),
        selectedGroupId: null,
        selectedUnitId: null,
        selectedBinId: null,
        isAvailable: null,
        responseMessage: '',
        submitted: false,
        post: Vue.observable(),
    },
    created: function () {
        //this.LoadBaseInfo();
        this.loadGroups();
        this.loadBins();
        this.loadUoms();
        console.log(this.post);
    },
    mounted: function () {
        console.log('Mounted baseinfo');
        //this.loadGroups();
    },
    updated: function () {
        console.log('Updated baseinfo');
    },
    computed: {
    },
    methods: {
        onChange: function (event) {
            this.selectedGroupId = this.selectedGroup.airlineSupplierId;
        },
        loadGroups: function () {
            //axios({
            //    method: 'POST',
            //    url: '/api/AirlineSupplierApi/GroupLookup'
            //}).then(res => {
            //    //console.log(res.data);
            //    this.groups = res.data;
            //}).catch(function (error) {
            //    console.log(error);
            //});
            fetch("/api/AirlineSupplierApi/GroupLookup")
                .then(response => response.json())
                .then(data => (this.groups = data))
                .then(function (json) {
                    this.groups = json
                }).catch(function (ex) {
                    console.log('parsing failed', ex)
                })
        },
        fuseSearch_group(options, search) {
            const fuse = new Fuse(options, {
                keys: ["airlineSupplierCode", "airlineSupplierName"],
                shouldSort: true
            });
            return search.length
                ? fuse.search(search).map(({ item }) => item)
                : fuse.list;
        },
        onChangeBin: function (event) {
            this.selectedBinId = this.selectedBin.binId;
        },
        loadBins: function () {
            axios({
                method: 'GET',
                url: '/api/BinApi/GetBinInfo'
            }).then(res => {
                console.log(res.data);
                this.bins = res.data;
            }).catch(function (error) {
                console.log(error);
            });
        },
        fuseSearch_bin(options, search) {
            const fuse = new Fuse(options, {
                keys: ["binCode", "binDescription"],
                shouldSort: true
            });
            return search.length
                ? fuse.search(search).map(({ item }) => item)
                : fuse.list;
        },
        onChangeUom: function (event) {
            this.selectedUnitId = this.selectedUnit.uomId;
        },
        loadUoms: function () {
            axios({
                method: 'POST',
                url: '/api/UomApi/GetUomInfo'
            }).then(res => {
                //console.log(res.data);
                this.uoms = res.data;
            }).catch(function (error) {
                console.log(error);
            });
        },
        fuseSearch_uom(options, search) {
            const fuse = new Fuse(options, {
                keys: ["uomCode", "uomName"],
                shouldSort: true
            });
            return search.length
                ? fuse.search(search).map(({ item }) => item)
                : fuse.list;
        },
        save: function (event) {
            this.submitted = true;
            let expiry = Boolean(this.selectedExpiry);
            let Min_Stock = 100;
            const { itemCode, selectedGroup, selectedUnit, selectedExpiry, discription } = this;
            if (itemCode && selectedGroup && selectedUnit && selectedExpiry && discription) {
                axios({
                    method: 'POST',
                    url: '/api/ItemApi/SetItemInfo',
                    data: {
                        "ItemCode": this.itemCode,
                        "UomId": parseInt(this.selectedUnitId),
                        "Status": this.status,
                        "ItemDecsiption": this.discription,
                        "BinId": parseInt(this.selectedBinId),
                        "IsExpiry": expiry,
                        "MinStock": parseFloat(Min_Stock),
                        "AirlineSupplierId": parseInt(this.selectedGroupId)
                    }
                }).then(res => {
                    alert(this.itemCode +" : Save Success !");
                    //swal({ text: 'The item is successfully created.', duration: 5000, pos: 'bottom-right' });
                    //this.$refs.form.reset();
                    this.itemCode = '';
                    this.discription = '';
                    this.selectedGroup = '';
                    this.selectedBin = '';
                    this.selectedUnit = '';
                    this.selectedExpiry = new Boolean(true);
                    //console.log(res.data);
                }).catch(function (error) {
                    console.log(error);
                });
             
            }
        },
        resetForm: function () {
            this.itemCode = '';
            this.discription = '';
            this.selectedGroup = '';
            this.selectedBin = '';
            this.selectedUnit = '';
            this.selectedExpiry = new Boolean(true);
        },
        checkItemCode: function () {
            var code = this.itemCode.trim();
            console.log(code)
            if (code != '') {

                axios({
                    method: 'POST',
                    url: '/api/ItemApi/ValidateItemCode',
                    data: {
                        "ItemCode": this.ItemCode
                    }
                }).then(res => {
                    console.log(res.data);
                    this.isAvailable = res.data;
                    if (res.data != 0) {
                        this.responseMessage = "Item Code is Available.";
                    } else {
                        this.responseMessage = "Item Code is not Available.";
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            } else {
                this.responseMessage = "";
            }

        },

    }
});

