export interface Review {
  author: string;
  rating: number;
  text: string;
  date: string;
  avatar: string;
}

export interface Spot {
  id: string;
  name: string;
  category: 'travel' | 'food' | 'cafe' | 'hotel' | 'shopping' | 'education' | 'beauty';
  subCategory: string;
  rating: number;
  address: string;
  district: string;
  priceRange: string;
  isOpen: boolean;
  hours: string;
  image: string;
  description: string;
  checkins: string;
  contact: string;
  highlights: string[];
  reviews: Review[];
  deals?: string[];
  facebookLink?: string;
}

export const SPOTS: Spot[] = [
  {
    id: 'pu-luong',
    name: 'Khu bảo tồn thiên nhiên Pù Luông',
    category: 'travel',
    subCategory: 'Thiên nhiên',
    rating: 4.9,
    address: 'Bá Thước & Quan Hóa, Thanh Hóa',
    district: 'Huyện Bá Thước',
    priceRange: '$$',
    isOpen: true,
    hours: 'Cả ngày',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP6v90wZipgXNroYfKmmSb290ynidcRzZUQt4HsPLdYTFZ4BG15xlvAnlnvlzp155klK49Yig87QU7TXKgpMK51ezkyqCX7wll6F852059jboer7SICPJwaiLOCSXJo3-OmIud7SSRJCZKcRKleIf5WwHnfvCNcwayN-3Tk3AzM0EaoYwAINzc0dRLIgouwpsRqo2olp5lFly6kt7AIgmP3TZrs2PcSXeEvCuDAQAq-4_HCpjXtlzfLw',
    description: 'Tuyệt tác ruộng bậc thang ẩn mình giữa đại ngàn mây trắng, điểm đến lý tưởng cho những tâm hồn yêu thiên nhiên hoang sơ. Pù Luông có những bản làng mộc mạc như bản Đôn, bản Kho Mường, và đỉnh núi cao hùng vĩ thu hút đông đảo phượt thủ.',
    checkins: '5.4k Check-ins',
    contact: '0981 123 456',
    highlights: ['Ruộng bậc thang vàng óng', 'Bản làng dân tộc Thái, Mường', 'Thác Hiêu hoang sơ', 'Săn mây đỉnh Pù Luông'],
    reviews: [
      { author: 'Minh Tuấn', rating: 5, text: 'Quá đẹp, không khí trong lành dễ chịu cực kỳ. Thung lũng ruộng bậc thang thu hút mọi ánh nhìn vào mùa lúa chín tháng 6 và tháng 10.', date: '2026-06-15', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80' },
      { author: 'Lan Anh', rating: 5, text: 'Trải nghiệm homestay của người Thái rất thích. Đồ ăn đặc sản như vịt Cổ Lũng cực kỳ ngon và béo ngậy.', date: '2026-07-02', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    deals: ['Giảm 15% cho đặt phòng bungalow tại Pù Luông Retreat trong tuần này', 'Tour leo núi săn mây trọn gói ưu đãi 10%']
  },
  {
    id: 'sam-son',
    name: 'Bãi biển Sầm Sơn',
    category: 'travel',
    subCategory: 'Biển',
    rating: 4.8,
    address: 'Đường Hồ Xuân Hương, TP. Sầm Sơn, Thanh Hóa',
    district: 'Thành phố Sầm Sơn',
    priceRange: '$$',
    isOpen: true,
    hours: 'Cả ngày',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwsDq3AUmCLCQyqcfoZChDeV4CbsMXbd_wQoP3p-mb-CEjzLCq9dUDQlImTvL43IkHw5huNCr8xytxmD8OE3TCz5dze34u8iUCOAxFxg_Ar6zHQYunosr-bZhj06E6YERjiwdmUGWgCIqLmQEI3pZ0mMy3WqLuq1Z4VQIIGXJX1bxMjwXgpXuNg6YRzFtJanPjUbCaPi7gr0v4PUHtA5vQ39cX4bXcLmXrMiBQf_SnE0A-WZtR4NQhqQ',
    description: 'Bãi biển nổi tiếng sầm uất hàng đầu miền Bắc với bờ cát trắng dài, sóng mạnh và nhiều hoạt động giải trí sôi động ngày đêm. Sầm Sơn ngày nay khang trang với quảng trường biển hiện đại, chuỗi resort cao cấp FLC và khu phố ẩm thực nhộn nhịp.',
    checkins: '12.8k Check-ins',
    contact: '0237 3821 555',
    highlights: ['Bãi tắm A, B, C, D rộng rãi', 'Đền Độc Cước linh thiêng', 'Hòn Trống Mái thơ mộng', 'Quảng trường biển rộng lớn'],
    reviews: [
      { author: 'Hoàng Hải', rating: 4, text: 'Bãi biển sóng rất to, tắm rất đã. Sầm Sơn dạo này quy hoạch đẹp hơn xưa nhiều, không còn tình trạng chặt chém.', date: '2026-07-05', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    deals: ['Combo vé vui chơi khu quảng trường biển & công viên nước giảm ngay 20%', 'Đón bình minh tại đền Độc Cước tặng nước mát miễn phí']
  },
  {
    id: 'thanh-nha-ho',
    name: 'Thành Nhà Hồ',
    category: 'travel',
    subCategory: 'Di tích',
    rating: 4.9,
    address: 'Vĩnh Long, Vĩnh Lộc, Thanh Hóa',
    district: 'Huyện Vĩnh Lộc',
    priceRange: '$',
    isOpen: true,
    hours: '07:30 - 18:00',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBHqKS0PcdFLnQop3yzYt14ascwFaLO6Q9THvIGfDH4UB1poeqaez7wOcXIVNcHJgG6sVdpaqHHsu3ERL_2EHHv3-XYgiW6SokdvU_qqbXv7-L-FRm0XgPtG-OJMK9ff16e1qnDC3FcVEeFlig4ei7VHcQos86y6DFjJLojmldGJ9FiNhHs7P6XpW_jfQg4DNK-sMS6PDALKCL2LIrO3oTSAT7a2T1CrEa_rE_FFV_rVJL9klhu0veaw',
    description: 'Tòa thành đá độc nhất vô nhị tại Việt Nam, kiệt tác kiến trúc quân sự cổ đại vươn tầm thế giới được UNESCO công nhận là Di sản văn hóa thế giới. Thành được xây dựng bằng những khối đá khổng lồ ghép khít khao mà không cần chất kết dính.',
    checkins: '3.2k Check-ins',
    contact: '0237 3870 099',
    highlights: ['Cổng Nam nguyên vẹn cổ kính', 'Kỹ thuật ghép đá khổng lồ vĩ đại', 'Không gian trưng bày cổ vật triều Hồ', 'Giới thiệu lịch sử Hồ Quý Ly'],
    reviews: [
      { author: 'Quốc Bảo', rating: 5, text: 'Giá trị lịch sử to lớn. Nhìn những khối đá nặng hàng chục tấn được ghép khít khao thực sự khâm phục tài trí cha ông xưa.', date: '2026-05-20', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    deals: ['Giảm 50% vé tham quan cho học sinh, sinh viên mang theo thẻ', 'Miễn phí hướng dẫn viên thuyết minh tại điểm cho đoàn trên 10 người']
  },
  {
    id: 'suoi-ca-than',
    name: 'Suối cá thần Cẩm Lương',
    category: 'travel',
    subCategory: 'Tâm linh',
    rating: 4.7,
    address: 'Bản Ngọc, Cẩm Lương, Cẩm Thủy, Thanh Hóa',
    district: 'Huyện Cẩm Thủy',
    priceRange: '$',
    isOpen: true,
    hours: '07:00 - 17:30',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAW0bzUtPvSfsg2qfO1sShrCvci6dmATzvlcE8tL3Ij9LuU7JsBXkl0fx_SRRXODQaeVwvS0mYP91NNbqxO5JucOakajbWB7XOfQBQMsbOwfxVjpCgbLUs8id7goKlIAC_-g8Rfuo_qHpinEwoWjW7SE6iTwBkSOC1FsZxJhXBjsABMXODKHPetFyFn_FTapWtXJMSZvfxMHgfv0kBSn1VxKtAI2ZTP5h3gps10MrFMWnEZiDUeu9FPbw',
    description: 'Dòng suối kỳ bí dưới chân núi Trường Sinh với hàng ngàn chú cá bơi lội mật độ dày đặc nhưng dòng nước vẫn luôn trong vắt, gắn liền với những truyền thuyết linh thiêng của đồng bào dân tộc Mường xứ Thanh.',
    checkins: '4.8k Check-ins',
    contact: '0912 345 678',
    highlights: ['Hàng vạn cá thần thân thiện', 'Đền Ngọc linh thiêng cổ kính', 'Khám phá hang động núi Trường Sinh', 'Thưởng thức cơm lam, gà đồi bản địa'],
    reviews: [
      { author: 'Thanh Vân', rating: 4, text: 'Rất kỳ lạ, cá bơi đầy suối sờ tay vào được nhưng không ai bắt ăn. Nước suối rất mát và sạch sẽ.', date: '2026-06-11', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    deals: ['Tặng gói đồ ăn cho cá khi mua từ 5 vé tham quan trở lên', 'Nước uống thảo mộc Mường miễn phí tại quầy lưu niệm']
  },
  {
    id: 'hai-san-bien-nho',
    name: 'Hải Sản Biển Nhớ',
    category: 'food',
    subCategory: 'Nhà hàng',
    rating: 4.8,
    address: 'Đường Hồ Xuân Hương, Sầm Sơn, Thanh Hóa',
    district: 'Thành phố Sầm Sơn',
    priceRange: '$$$',
    isOpen: true,
    hours: '09:00 - 23:30',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-JaO-nw9HTwBt6PO1DlYuuGIwXZNrnZE-jLVesxXGA56lUkmNGQN7JV2SP55D6HGU9CFGjJbol3vh_bK2iYiId-N3PAPLNq-hJ4EnZzbL2j_vQwWzEw5231nluxFhnCrt87AatpSjJQ1yWUdji31wEucrZE3QwgBEmnD7H8-iUtN1W8hQ05lMgjNDsyXwRorxcyOVz85ExkO-rw9KHSXNpAo-1_SwDjRyheSeeGOIRvh9Pb63vHbfqw',
    description: 'Nhà hàng hải sản tươi sống quy mô lớn bậc nhất Sầm Sơn. Vị trí đắc địa hướng thẳng quảng trường biển và đại dương, phục vụ đa dạng hải sản đánh bắt trong ngày như ghẹ, tôm hùm, cua gạch, mực nhảy.',
    checkins: '1.2k Check-ins',
    contact: '0237 3822 888',
    highlights: ['Hải sản tươi rói chọn tại bể', 'Không gian rộng rãi, thoáng gió biển', 'Chế biến nhanh, nêm nếm vừa vị', 'Chỗ đỗ xe ô tô cực rộng'],
    reviews: [
      { author: 'Hương Giang', rating: 5, text: 'Hải sản ở đây tươi sống nức tiếng. Con ghẹ chắc nịch, tôm nướng muối ớt thơm giòn. Giá cả niêm yết rõ ràng không sợ chém.', date: '2026-07-01', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    deals: ['Ưu đãi giảm 10% trên tổng hóa đơn thức ăn cho khách đặt bàn trước qua Hotline', 'Miễn phí cháo hải sản khai vị cho bàn trên 6 khách']
  },
  {
    id: 'nem-chua-thanh-mai',
    name: 'Nem Chua Thanh Mai',
    category: 'food',
    subCategory: 'Quán ăn bình dân',
    rating: 4.6,
    address: 'Số 12 Trường Thi, TP. Thanh Hóa',
    district: 'Thành phố Thanh Hóa',
    priceRange: '$',
    isOpen: true,
    hours: '07:00 - 21:00',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCc_Yqaj-Ll06Tz2HkNl4SwdiUG9ushy_CTvLJVSUCuqIMi8QTfiJ9nkL9DHJmOSZrWdcpEYPUvKcRFmqIzwbhB9tUFd5bjJnaj3T-0x3fCxPGRLFUFCvmTW3VilQIwDkEiTEMbOaEQjOC-8yir6Yi_P_OJQ235jbgEWTpSyskQ0li20EC-fHx8PUVrERJupk49O30Y0CmDp7cxpCbw7O7cJCeNH5jUxURVmWXJ0j_quxB7x-ZPUeo-mw',
    description: 'Thương hiệu nem chua truyền thống gia truyền lâu đời tại TP. Thanh Hóa. Nem chua được gói chặt tay, lá chuối xanh mướt, vị chua thanh nhẹ hòa cùng độ ngọt dai của bì lợn, cay nồng của ớt, thơm phức của tỏi.',
    checkins: '850 Check-ins',
    contact: '0943 567 889',
    highlights: ['Nem chua rán giòn, nem ngọt cay', 'Chuẩn hương vị cổ truyền xứ Thanh', 'Nguyên liệu sạch, chế biến vệ sinh', 'Đóng gói quà tặng sang trọng'],
    reviews: [
      { author: 'Trần Long', rating: 5, text: 'Nem chua ở đây chuẩn vị nhất Thanh Hóa. Mua mang về làm quà ai cũng khen tấm tắc. Lá chuối mỏng, ruột nem dày.', date: '2026-06-29', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    deals: ['Mua 10 chục nem chua tặng ngay 1 chục cùng loại', 'Hỗ trợ ship nhanh ra ga tàu và bến xe miễn phí cho đơn từ 200k']
  },
  {
    id: 'nha-hang-da-lan',
    name: 'Nhà Hàng Dạ Lan',
    category: 'food',
    subCategory: 'Nhà hàng',
    rating: 4.9,
    address: 'Số 01 Phan Chu Trinh, TP. Thanh Hóa',
    district: 'Thành phố Thanh Hóa',
    priceRange: '$$',
    isOpen: true,
    hours: '08:00 - 22:30',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQFjNZ6Y5yZxFKWV95IO-V1FF6f4q_cq8j_6FnBCXkepEouHDyW03sYk7IEOFKLRwkR83ELB-ot9HAc0AslfFNRy-sAtpCBPtaCuoRjc_f33DWhsR4c7bbkpMnLgb2z4K96d-2zLGzqqfIcMPhXOisstJlg1PaQz0_d1Uz7B831Veh3RTyc41TQ6TS-ZQLFkc9adTr0HcwTgbX9rfNyiYCLFfH3Hdl2Du3ohKe4y7HQNJXJgq1ZUrQNA',
    description: 'Một trong những nhà hàng sang trọng lâu đời nhất TP. Thanh Hóa. Chuyên phục vụ các món ăn đặc sản rừng - biển đa dạng, không gian phòng tiệc ấm cúng, sang trọng phù hợp cho những dịp liên hoan, hội nghị và họp mặt gia đình.',
    checkins: '3.4k Check-ins',
    contact: '0237 3852 168',
    highlights: ['Không gian kiến trúc Đông Dương', 'Đội ngũ đầu bếp tay nghề cao', 'Phục vụ chuyên nghiệp chu đáo', 'Hệ thống phòng VIP riêng tư'],
    reviews: [
      { author: 'Đức Huy', rating: 5, text: 'Dạ Lan là thương hiệu biểu tượng của thành phố rồi. Đồ ăn chế biến rất ngon, phục vụ chu đáo lịch sự vô cùng.', date: '2026-06-05', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    deals: ['Giảm 5% cho khách hàng tổ chức tiệc sinh nhật trùng ngày', 'Miễn phí setup âm thanh, ánh sáng cho sự kiện trên 30 khách']
  },
  {
    id: 'coastal-roasters',
    name: 'The Coastal Roasters',
    category: 'cafe',
    subCategory: 'Quán Cafe',
    rating: 4.8,
    address: 'Đường Tây Sơn, P. Trường Sơn, Sầm Sơn',
    district: 'Thành phố Sầm Sơn',
    priceRange: '$$',
    isOpen: true,
    hours: '07:00 - 22:30',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&h=400&q=80',
    description: 'Quán cafe rang xay specialty duy nhất nằm sát sườn núi Trường Sơn, view trọn bãi biển Sầm Sơn bao la. Không gian thiết kế tối giản thô mộc, lộng gió biển mát rượi và ngập tràn mùi cà phê thơm lừng.',
    checkins: '1.5k Check-ins',
    contact: '0979 888 999',
    highlights: ['Cà phê Specialty tự rang', 'View biển ngắm hoàng hôn cực đỉnh', 'Phong cách tối giản tinh tế', 'Nhân viên thân thiện, am hiểu cafe'],
    reviews: [
      { author: 'Khánh Linh', rating: 5, text: 'Quán có view biển xuất sắc nhất Sầm Sơn. Nhâm nhi ly latte nóng hổi đón gió biển buổi sáng là trải nghiệm không thể quên.', date: '2026-07-04', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    deals: ['Mua combo 1 bánh ngọt + 1 cafe bất kỳ chỉ với 65k vào khung giờ 07h-09h sáng', 'Tặng postcard Sầm Sơn vẽ tay xinh xắn']
  },
  {
    id: 'greenhouse-cafe',
    name: 'Greenhouse Cafe & Bakery',
    category: 'cafe',
    subCategory: 'Quán Cafe',
    rating: 4.7,
    address: '25 Lê Lợi, TP. Thanh Hóa',
    district: 'Thành phố Thanh Hóa',
    priceRange: '$$',
    isOpen: true,
    hours: '06:30 - 22:30',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&h=400&q=80',
    description: 'Quán cafe kính xanh ngát ngập tràn hoa lá ngay giữa trung tâm thành phố. Sự lựa chọn hoàn hảo cho các bạn trẻ thích làm việc, đọc sách hoặc tụ tập bạn bè trò chuyện cuối tuần trong không gian trong lành, yên tĩnh.',
    checkins: '2.1k Check-ins',
    contact: '0834 567 890',
    highlights: ['Không gian vườn kính xanh mát', 'Bánh sừng bò nướng nóng hổi mỗi ngày', 'Trà trái cây nhiệt đới tươi mát', 'Góc sống ảo ngập tràn hoa'],
    reviews: [
      { author: 'Ngọc Mai', rating: 5, text: 'Bánh sừng bò trứng muối ở đây xuất sắc! Quán nhiều cây xanh mát mắt, ngồi làm việc dễ chịu tuyệt đối.', date: '2026-06-21', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    deals: ['Ưu đãi Giảm 15% cho tất cả các loại trà hoa quả trong ngày thứ Tư xanh', 'Thẻ tích điểm đổi bánh ngọt miễn phí']
  },
  {
    id: 'muong-thanh-luxury',
    name: 'Khách Sạn Mường Thanh Luxury Thanh Hóa',
    category: 'hotel',
    subCategory: 'Khách sạn',
    rating: 4.8,
    address: 'Lô C1-D6, Khu đô thị Đông Vệ, TP. Thanh Hóa',
    district: 'Thành phố Thanh Hóa',
    priceRange: '$$$',
    isOpen: true,
    hours: '24/7',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&h=400&q=80',
    description: 'Khách sạn đạt tiêu chuẩn 5 sao quốc tế hàng đầu tại TP. Thanh Hóa. Sở hữu hệ thống phòng nghỉ sang trọng, hồ bơi ngoài trời rộng lớn, trung tâm hội nghị tiệc cưới đẳng cấp và chuỗi dịch vụ spa, massage cao cấp.',
    checkins: '4.2k Check-ins',
    contact: '0237 8868 686',
    highlights: ['Phòng nghỉ view bao quát toàn thành phố', 'Bể bơi ngoài trời xanh ngắt rộng lớn', 'Ăn sáng buffet phong phú Á - Âu', 'Trung tâm gym & spa hiện đại'],
    reviews: [
      { author: 'Quang Anh', rating: 5, text: 'Phòng ốc rộng rãi, cực kỳ sạch sẽ. Nhân viên chào hỏi thân thiện, buffet sáng rất đa dạng các món ăn truyền thống.', date: '2026-07-01', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    deals: ['Đặt phòng Deluxe tặng ngay 1 lượt massage đá nóng 45 phút tại Spa', 'Buffet cuối tuần mua 3 tặng 1 cho cả gia đình']
  },
  {
    id: 'melia-vinpearl',
    name: 'Meliá Vinpearl Thanh Hóa',
    category: 'hotel',
    subCategory: 'Khách sạn',
    rating: 4.9,
    address: 'Số 27 Trần Phú, P. Điện Biên, TP. Thanh Hóa',
    district: 'Thành phố Thanh Hóa',
    priceRange: '$$$',
    isOpen: true,
    hours: '24/7',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&h=400&q=80',
    description: 'Tòa tháp khách sạn cao nhất thành phố nằm tại vị trí vàng ngã tư Trần Phú. Meliá Vinpearl đem lại trải nghiệm lưu trú thượng lưu bậc nhất với phòng ốc thiết kế tân cổ điển tinh tế, Skybar tầng thượng view 360 độ cực kỳ lãng mạn.',
    checkins: '5.6k Check-ins',
    contact: '0237 8936 888',
    highlights: ['Vị trí tâm điểm kết nối thương mại', 'Skybar ngắm trọn thành phố về đêm', 'Kết nối trực tiếp trung tâm thương mại', 'Bể bơi bốn mùa trong nhà'],
    reviews: [
      { author: 'Phương Thảo', rating: 5, text: 'Trải nghiệm đỉnh cao. Buổi tối lên Skybar nhâm nhi cocktail ngắm thành phố lấp lánh đèn cực kỳ đẹp luôn.', date: '2026-06-18', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    deals: ['Ưu đãi đặt sớm trước 14 ngày giảm ngay 15% tiền phòng', 'Tặng coupon nước uống miễn phí tại Sky Bar']
  },
  {
    id: 'vincom-plaza',
    name: 'Vincom Plaza Thanh Hóa',
    category: 'shopping',
    subCategory: 'Mua sắm',
    rating: 4.7,
    address: 'Số 27 Trần Phú, P. Điện Biên, TP. Thanh Hóa',
    district: 'Thành phố Thanh Hóa',
    priceRange: '$$',
    isOpen: true,
    hours: '09:30 - 22:00',
    image: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=600&h=400&q=80',
    description: 'Trung tâm thương mại hiện đại, sầm uất hàng đầu tại Thanh Hóa. Tích hợp khu mua sắm các thương hiệu quốc tế nổi tiếng, chuỗi nhà hàng ẩm thực Hàn - Nhật - Ý, rạp chiếu phim CGV chất lượng cao và khu vui chơi trẻ em năng động.',
    checkins: '9.2k Check-ins',
    contact: '0237 3728 555',
    highlights: ['Hàng trăm thương hiệu thời trang lớn', 'Rạp chiếu phim CGV cực hiện đại', 'Phố ẩm thực lẩu nướng đa dạng', 'Siêu thị WinMart tiện lợi'],
    reviews: [
      { author: 'Tuấn Đạt', rating: 5, text: 'Điểm ăn chơi mua sắm cuối tuần quen thuộc của cả gia đình tôi. Đầy đủ tiện ích từ ăn uống, xem phim đến mua sắm.', date: '2026-07-06', avatar: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    deals: ['Săn deal chớp nhoáng tại rạp chiếu phim CGV đồng giá vé 55k ngày thứ Tư', 'Hóa đơn mua sắm WinMart từ 500k tặng voucher ẩm thực']
  },
  {
    id: 'dai-hoc-hong-duc',
    name: 'Trường Đại Học Hồng Đức',
    category: 'education',
    subCategory: 'Trường học',
    rating: 4.8,
    address: '565 Quang Trung, P. Đông Vệ, TP. Thanh Hóa',
    district: 'Thành phố Thanh Hóa',
    priceRange: '$',
    isOpen: true,
    hours: '07:00 - 18:00',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&h=400&q=80',
    description: 'Ngôi trường đại học công lập đa ngành lớn nhất tỉnh Thanh Hóa, mang tên người anh hùng dân tộc Lê Thánh Tông (niên hiệu Hồng Đức). Trường sở hữu khuôn viên xanh rộng lớn, cơ sở vật chất giảng đường hiện đại bậc nhất khu vực Bắc Trung Bộ.',
    checkins: '11.5k Check-ins',
    contact: '0237 3910 730',
    highlights: ['Khuôn viên xanh ngát hiện đại', 'Chương trình đào tạo đa ngành', 'Trung tâm nghiên cứu khoa học lớn', 'Ký túc xá khang trang đầy đủ tiện nghi'],
    reviews: [
      { author: 'Văn Phong', rating: 5, text: 'Ngôi trường tự hào của người dân Thanh Hóa. Giảng đường, cơ sở vật chất vô cùng hoành tráng, khuôn viên đẹp như công viên.', date: '2026-05-12', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    deals: ['Đăng ký hội thảo hướng nghiệp miễn phí cho sinh viên cuối cấp', 'Giảm 20% học phí khóa tiếng Anh kỹ năng cho tân sinh viên']
  },
  {
    id: 'sen-spa',
    name: 'Sen Spa & Wellness Thanh Hóa',
    category: 'beauty',
    subCategory: 'Spa & Trị Liệu',
    rating: 4.9,
    address: 'Số 36 Đại lộ Lê Lợi, TP. Thanh Hóa',
    district: 'Thành phố Thanh Hóa',
    priceRange: '$$',
    isOpen: true,
    hours: '09:00 - 22:00',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&h=400&q=80',
    description: 'Không gian dưỡng sinh & spa trị liệu chuẩn Đông Y hàng đầu xứ Thanh. Nổi tiếng với liệu pháp xông hơi đá muối Himalaya, massage bấm huyệt thảo dược giúp xua tan mệt mỏi, tái tạo năng lượng thể chất và tinh thần sau những ngày làm việc hay di chuyển vất vả.',
    checkins: '1.8k Check-ins',
    contact: '0237 3888 999',
    highlights: ['Xông hơi đá muối Himalaya', 'Liệu pháp thải độc Đông Y cổ truyền', 'Không gian thảo mộc mộc mạc thư giãn', 'Trà dưỡng nhan phục vụ miễn phí'],
    reviews: [
      { author: 'Minh Hằng', rating: 5, text: 'Quán decor cực kỳ đẹp và yên tĩnh, thoang thoảng mùi sả chanh rất dễ chịu. Massage đá nóng bấm huyệt xong người nhẹ bẫng luôn, cực kỳ đề xuất!', date: '2026-07-06', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    deals: ['Giảm ngay 20% cho nhóm khách từ 3 người đặt lịch xông hơi trọn gói', 'Tặng gói ngâm chân thảo dược trị giá 100k']
  },
  {
    id: 'hana-academy',
    name: 'Viện Thẩm Mỹ Hana Beauty',
    category: 'beauty',
    subCategory: 'Chăm Sóc Da',
    rating: 4.8,
    address: 'Lô 18 Lê Hoàn, P. Điện Biên, TP. Thanh Hóa',
    district: 'Thành phố Thanh Hóa',
    priceRange: '$$$',
    isOpen: true,
    hours: '08:30 - 20:00',
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=600&h=400&q=80',
    description: 'Viện chăm sóc và điều trị da công nghệ cao chuẩn y khoa hàng đầu tại Thanh Hóa. Với trang thiết bị tiên tiến bậc nhất nhập khẩu từ Mỹ, Hàn Quốc cùng đội ngũ chuyên gia da liễu giàu kinh nghiệm, Hana Beauty mang lại vẻ đẹp tự nhiên, rạng ngời cho bạn.',
    checkins: '1.2k Check-ins',
    contact: '0945 123 789',
    highlights: ['Điều trị mụn, thâm, nám chuyên sâu', 'Phun xăm thẩm mỹ nghệ thuật Hàn Quốc', 'Trẻ hóa da công nghệ nâng cơ Hifu', 'Sử dụng dược mỹ phẩm cao cấp an toàn'],
    reviews: [
      { author: 'Quỳnh Trang', rating: 5, text: 'Mình điều trị mụn ở đây thấy rất hiệu quả, bác sĩ tư vấn kỹ lưỡng, phòng ốc vô trùng sạch sẽ hiện đại.', date: '2026-07-02', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    deals: ['Soi da & tư vấn phác đồ điều trị da miễn phí trị giá 300k', 'Voucher giảm 10% dịch vụ phun xăm mày môi']
  },
  {
    id: 'xu-thanh-studio',
    name: 'Xứ Thanh Studio - Chụp Ảnh Ngoại Cảnh & Cưới',
    category: 'beauty',
    subCategory: 'Dịch Vụ Chụp Ảnh',
    rating: 4.9,
    address: '122 Cao Thắng, P. Lam Sơn, TP. Thanh Hóa',
    district: 'Thành phố Thanh Hóa',
    priceRange: '$$',
    isOpen: true,
    hours: '08:00 - 21:00',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&h=400&q=80',
    description: 'Studio nhiếp ảnh chuyên nghiệp và trang điểm cô dâu nghệ thuật nổi tiếng nhất Thanh Hóa. Chuyên cung cấp các gói chụp ảnh ngoại cảnh siêu nghệ thuật tại Pù Luông, chụp hình kỷ niệm cổ phục tại Thành Nhà Hồ và chụp ảnh cưới Sầm Sơn lãng mạn.',
    checkins: '2.5k Check-ins',
    contact: '0979 246 810',
    highlights: ['Trang điểm make-up bắt trend chuyên nghiệp', 'Kho trang phục cổ phục, váy cưới, áo dài khổng lồ', 'Ekip chụp hình vui tính, tạo dáng siêu tự nhiên', 'Chỉnh sửa ảnh kỹ lưỡng tỉ mỉ từng chi tiết'],
    reviews: [
      { author: 'Thanh Lam', rating: 5, text: 'Ekip siêu có tâm luôn! Bọn mình chụp bộ ảnh áo dài ở Thành Nhà Hồ đẹp xuất sắc, ai nhìn cũng khen. Anh thợ ảnh chỉ dẫn tạo dáng nhiệt tình lắm luôn.', date: '2026-06-25', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    deals: ['Trọn gói chụp ảnh ngoại cảnh cổ phục áo dài giảm ngay 15% kèm make-up', 'Tặng ảnh cổng lớn 60x90 cho khách đặt gói chụp album cưới']
  },
  {
    id: 'sam-son-photo',
    name: 'Sầm Sơn Beach Photo & Makeup',
    category: 'beauty',
    subCategory: 'Dịch Vụ Chụp Ảnh',
    rating: 4.7,
    address: 'Ki-ốt 15 Đường Hồ Xuân Hương, TP. Sầm Sơn',
    district: 'Thành phố Sầm Sơn',
    priceRange: '$$',
    isOpen: true,
    hours: '05:00 - 20:00',
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&h=400&q=80',
    description: 'Dịch vụ nhiếp ảnh bãi biển trọn gói: Chuyên săn khoảnh khắc đón bình minh rực rỡ và hoàng hôn lãng mạn trên biển Sầm Sơn. Cung cấp dịch vụ trang điểm cá nhân nhẹ nhàng chuẩn phong cách nàng thơ đi biển và cho thuê váy maxi lộng lẫy.',
    checkins: '1.4k Check-ins',
    contact: '0888 333 444',
    highlights: ['Makeup nàng thơ trong veo đi biển chống nước', 'Chụp ảnh bình minh sớm đón sóng biển Sầm Sơn', 'Cho thuê đầm maxi bay bổng chụp ảnh cực chất', 'Nhận file gốc ngay trong ngày sau buổi chụp'],
    reviews: [
      { author: 'Lan Anh', rating: 5, text: 'Trang điểm rất tự nhiên, chụp ảnh bắt khoảnh khắc sóng vỗ siêu đẹp luôn. Rất hợp cho các bạn nữ đi du lịch một mình muốn có ảnh sống ảo triệu like!', date: '2026-07-04', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    deals: ['Gói chụp đơn điệu "Nàng thơ biển cả" chỉ 499k (đã gồm trang điểm & váy)', 'Miễn phí thuê phụ kiện mũ cói, hoa tai, kính râm']
  },
  {
    id: 'may-corner',
    name: 'Mây Corner - Tiệm Ảnh Cổ Phục & Ngoại Cảnh',
    category: 'beauty',
    subCategory: 'Dịch Vụ Chụp Ảnh',
    rating: 4.9,
    address: 'Bản Đôn, xã Thành Lâm, Bá Thước, Thanh Hóa',
    district: 'Huyện Bá Thước',
    priceRange: '$$',
    isOpen: true,
    hours: '07:30 - 18:30',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&h=400&q=80',
    description: 'Chuyên cung cấp trang phục cổ phục Việt Nam (Việt phục, Nhật Bình, Áo tấc) và trang phục dân tộc Thái, Mường cao cấp. Dịch vụ chụp ảnh ngoại cảnh trọn gói chuyên nghiệp tại ruộng bậc thang Pù Luông mộng mơ.',
    checkins: '1.9k Check-ins',
    contact: '0912 345 678',
    highlights: ['Cho thuê cổ phục Việt cổ kính, trang phục dân tộc thêu tay tỉ mỉ', 'Nhiếp ảnh gia bản địa am hiểu mọi góc chụp đẹp nhất Pù Luông', 'Make-up phong cách Á Đông cổ điển, sang trọng', 'Có flycam hỗ trợ quay thước phim kỷ niệm tuyệt mỹ'],
    reviews: [
      { author: 'Thu Phương', rating: 5, text: 'Quần áo cổ phục ở đây siêu mới và đẹp, nhân viên hỗ trợ mặc đồ và làm tóc nhiệt tình khủng khiếp. Mình có bộ ảnh lúa chín đỉnh chóp luôn!', date: '2026-06-20', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    deals: ['Thuê cổ phục tặng kèm gói thắt tóc nghệ thuật và phụ kiện trâm cài tai', 'Giảm 10% khi đặt lịch chụp ngoại cảnh trước 3 ngày']
  },
  {
    id: 'lavender-spa',
    name: 'Lavender Premium Spa & Clinic',
    category: 'beauty',
    subCategory: 'Spa & Trị Liệu',
    rating: 4.8,
    address: '286 Triệu Quốc Đạt, P. Điện Biên, TP. Thanh Hóa',
    district: 'Thành phố Thanh Hóa',
    priceRange: '$$$',
    isOpen: true,
    hours: '09:00 - 21:30',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=600&h=400&q=80',
    description: 'Tận hưởng thiên đường thư giãn cao cấp với phương pháp trị liệu thảo dược tự nhiên và liệu trình chăm sóc da organic chuẩn châu Âu. Sở hữu phòng sauna xông hơi khép kín đẳng cấp và đội ngũ trị liệu viên tay nghề cao giúp hồi phục cơ thể toàn diện.',
    checkins: '2.1k Check-ins',
    contact: '0237 3666 888',
    highlights: ['Trị liệu đau vai gáy bằng thảo dược nóng chuyên sâu', 'Tắm trắng ngọc trai phục hồi da chuyên biệt', 'Xông hơi Sauna ướt và khô thảo dược tinh dầu sả', 'Không gian phòng VIP riêng tư yên tĩnh tuyệt đối'],
    reviews: [
      { author: 'Khánh Linh', rating: 5, text: 'Xông hơi xong rồi được massage tinh dầu ở đây siêu phê. Kỹ thuật viên đấm bóp có lực, nhiệt tình, không gian sang trọng thơm ngát hương hoa lavender.', date: '2026-07-01', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80' }
    ],
    deals: ['Giảm 30% cho khách hàng đầu tiên trải nghiệm liệu trình vai gáy Đông Y', 'Mừng sinh nhật giảm 15% tất cả các dịch vụ lẻ chăm sóc da clinic']
  }
];

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  image: string;
  date: string;
  author: string;
  readTime: string;
  facebookLink?: string;
}

export const ARTICLES: Article[] = [
  {
    id: 'pu-luong-photo-guide',
    title: 'Bí quyết oanh tạc Pù Luông: Chọn trang phục và chụp ảnh ngoại cảnh cực nghệ',
    summary: 'Làm sao để sở hữu album ảnh xuất sắc giữa thung lũng lúa chín mây ngàn? Bỏ túi ngay kinh nghiệm vàng chọn góc chụp và đơn vị makeup chụp ảnh có tâm tại Pù Luông.',
    category: 'beauty',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&h=400&q=80',
    date: '2026-07-07',
    author: 'Minh Hằng (Travel Blogger)',
    readTime: '5 phút đọc',
    content: `Chào các bạn đam mê xê dịch! Pù Luông luôn là thiên đường mộng mơ với ruộng bậc thang bát ngát trải dài, sương mù quấn quýt quanh những đỉnh núi cao. Tuy nhiên, để lưu lại những khoảnh khắc đẹp "không tì vết", việc chuẩn bị kỹ phục trang và ê-kíp nhiếp ảnh là cực kỳ quan trọng. Dưới đây là kinh nghiệm mà mình đúc kết được sau 3 lần tới Pù Luông:

1. **Chọn Trang Phục Nổi Bật Giữa Sắc Xanh**:
   - Nếu bạn đi vào mùa lúa xanh hoặc lúa chín vàng (Tháng 6 & Tháng 10), hãy ưu tiên các tông màu váy áo như **đỏ, trắng, vàng nghệ hoặc các bộ đồ phong cách thổ cẩm boho**. Màu sắc tương phản cao sẽ giúp bạn nổi bật tuyệt đối giữa nền ruộng bậc thang xanh/vàng.
   - Tránh mặc trang phục màu xanh lá cây hoặc các họa tiết quá nhỏ nhặt vì sẽ dễ bị chìm nghỉm vào khung cảnh đại ngàn.

2. **Gợi Ý Địa Điểm Lên Hình Hoàn Hảo**:
   - **Bản Đôn**: Trọng tâm lúa bậc thang, có những chiếc xích đu gỗ hướng thung lũng lộng gió.
   - **Bản Kho Mường**: Thung lũng hoang sơ với những nếp nhà sàn lợp ngói âm dương bạc màu thời gian.
   - **Thác Hiêu**: Thác nước đá vôi nước trong màu ngọc bích, thích hợp cho phong cách phiêu lưu, tươi mát.

3. **Chọn Studio Có Tâm & Hiểu Rõ Địa Hình**:
   - Để có những góc máy độc lạ và canh được hướng ánh sáng bình minh, hoàng hôn tốt nhất, bạn nên chọn các studio có ê-kíp thực chiến lâu năm ở địa phương như **Xứ Thanh Studio**. Các nhiếp ảnh gia địa phương sẽ biết chính xác ruộng nào chín trước, đồi nào ngắm mây đẹp nhất tùy từng tuần mà không cần tốn thời gian dò tìm.`
  },
  {
    id: 'top-spa-thanh-hoa',
    title: 'Top Spa dưỡng sinh & điều trị da thư giãn nhất tại TP. Thanh Hóa',
    summary: 'Phục hồi năng lượng sau những ngày dài mỏi mệt. Khám phá ngay các địa chỉ xông hơi đá muối thảo mộc và massage trị liệu chuẩn Đông Y tốt nhất xứ Thanh.',
    category: 'beauty',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&h=400&q=80',
    date: '2026-07-05',
    author: 'Thùy Dương (Beauty Editor)',
    readTime: '4 phút đọc',
    content: `Sau một tuần làm việc căng thẳng hay sau những chuyến đi leo núi săn mây dốc sức tại Pù Luông, cơ thể chúng ta cần được nghỉ ngơi, phục hồi sâu. Tại thành phố Thanh Hóa, trào lưu spa dưỡng sinh và gội đầu dưỡng thảo mộc kết hợp trị liệu Đông Y đang lên ngôi.

Dưới đây là 2 gợi ý hàng đầu bạn không thể bỏ qua:

1. **Sen Spa & Wellness - Nơi Trả Lại Sự Cân Bằng**:
   - **Điểm đặc biệt**: Không gian được bài trí mộc mạc, tĩnh lặng tuyệt đối với tiếng nhạc thiền êm dịu và hương tinh dầu sả chanh phảng phất.
   - **Liệu trình khuyên dùng**: Xông hơi đá muối Himalaya kết hợp massage bấm huyệt đá nóng thảo dược. Sức nóng từ đá muối kết hợp các khoáng chất tự nhiên giúp giải độc da, lưu thông khí huyết, giảm ngay các chứng đau mỏi vai gáy đặc trưng của dân văn phòng.

2. **Viện Thẩm Mỹ Hana Beauty - Chuyên Sâu Công Nghệ Cao**:
   - **Điểm đặc biệt**: Dành cho những ai muốn chăm sóc da chuyên nghiệp, trị liệu mụn thâm sau chuyến du lịch dài tiếp xúc nhiều khói bụi nắng gió.
   - **Liệu trình khuyên dùng**: Gói phục hồi da chuẩn y khoa và soi da công nghệ Hàn Quốc giúp làm sạch sâu, cấp ẩm tức thì, giúp làn da sáng khỏe tự nhiên.`
  },
  {
    id: 'sam-son-photo-wedding',
    title: 'Kinh nghiệm chụp ảnh cưới & dã ngoại lãng mạn tại biển Sầm Sơn từ A-Z',
    summary: 'Bắt trọn ánh nắng bình minh hồng hoang trên sóng biển. Gợi ý các địa điểm chụp ảnh cưới, xu hướng makeup nàng thơ biển cả cực kỳ thu hút cho bạn trẻ.',
    category: 'beauty',
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&h=400&q=80',
    date: '2026-06-28',
    author: 'Đức Thịnh (Wedding Planner)',
    readTime: '6 phút đọc',
    content: `Biển Sầm Sơn không chỉ sầm uất nhộn nhịp vào kỳ nghỉ mát, mà còn là nguồn cảm hứng dạt dào cho những album ảnh cưới hay dã ngoại sống ảo độc đáo. Với bãi cát phẳng mịn dài hơn 6km và những mỏm đá tự nhiên tuyệt đẹp bên chân núi Trường Sơn, bạn hoàn toàn có thể sở hữu những thước phim lãng mạn như phim Hàn Quốc.

**Khung Giờ Vàng Chụp Biển Không Thể Bỏ Lỡ**:
1. **Bình Minh Rực Rỡ (05h00 - 06h30 sáng)**:
   - Đây là thời điểm tuyệt diệu nhất. Ánh sáng vàng hồng ấm áp phản chiếu trên mặt nước biển phẳng lặng lấp lánh như gương. Biển lúc này rất vắng khách tắm, không gian yên bình để tha hồ tạo dáng chụp ngoại cảnh bay bổng.

2. **Chiều Tà Lãng Mạn (16h30 - 18h00 chiều)**:
   - Ánh nắng chiều dịu mát giúp làn da lên hình mướt mà, bóng mịn. Bạn có thể di chuyển ra khu vực Hòn Trống Mái thơ mộng hoặc rặng thông xanh mát mắt bên sườn núi để đổi gió cho album ảnh phong phú hơn.

**Bí Quyết Trang Điểm Đi Biển Chống Trôi**:
- Hãy chọn dịch vụ makeup chuyên nghiệp như **Sầm Sơn Beach Photo & Makeup**. Họ sử dụng các dòng phấn phủ kiềm dầu chống trôi nước cao cấp, giúp phong cách trang điểm nhẹ nhàng trong trẻo kiểu "nàng thơ biển cả" giữ nguyên vẹn suốt buổi chụp dã ngoại đầy nắng gió biển.`
  }
];

export interface SpecialtyDish {
  id: string;
  name: string;
  image: string;
  description: string;
  whereToEat: string[];
  bestTime: string;
  tags: string[];
}

export const SPECIALTY_DISHES: SpecialtyDish[] = [
  {
    id: 'nem-chua',
    name: 'Nem Chua Thanh Hóa',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&h=400&q=80',
    description: 'Là niềm tự hào ẩm thực của người dân xứ Thanh. Nem chua được làm từ thịt lợn nạc giã nhuyễn, bì lợn thái sợi mỏng, thính gạo, tỏi, ớt hiểm và lá đinh lăng, gói chặt trong nhiều lớp lá chuối để lên men tự nhiên. Nem có vị chua thanh dịu, giòn sần sật của bì heo, cay nhẹ của ớt và thơm lừng vị tỏi.',
    whereToEat: ['Nem chua Thanh Mai (12 Trường Thi, TP. Thanh Hóa)', 'Nem chua Tuyến Đá (TP. Thanh Hóa)', 'Nem chua Bà Thường (TP. Thanh Hóa)'],
    bestTime: 'Quanh năm, thích hợp làm quà tặng',
    tags: ['Đặc sản quốc dân', 'Lên men tự nhiên', 'Giòn ngon chuẩn vị']
  },
  {
    id: 'cha-tom',
    name: 'Chả Tôm Xứ Thanh',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&h=400&q=80',
    description: 'Món ăn dân dã nhưng chế biến cực kỳ cầu kỳ và tỉ mỉ. Nhân chả được làm từ tôm sông giã nhỏ xào cùng mỡ băm, hành củ, bọc trong một lớp bánh phở cắt nhỏ dai mịn, kẹp vào nẹp tre rồi nướng chín trên than hoa đỏ rực. Khi ăn vỏ bánh phở giòn rụm thơm phức, nhân tôm ngọt lịm béo ngậy, ăn kèm nước chấm dưa góp chua ngọt và rau sống thanh mát.',
    whereToEat: ['Chả tôm Thảo Mười (14 Nhà Thờ, TP. Thanh Hóa)', 'Chả tôm Đào Duy Từ (TP. Thanh Hóa)', 'Chả tôm Bà Thật (Chợ Tây Thành, TP. Thanh Hóa)'],
    bestTime: 'Chiều tối, đặc biệt vào những ngày se lạnh',
    tags: ['Nướng than hoa', 'Giòn rụm ngọt thơm', 'Quà vặt hè phố']
  },
  {
    id: 'banh-cuon',
    name: 'Bánh Cuốn Thanh Hóa',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&h=400&q=80',
    description: 'Bánh cuốn xứ Thanh mỏng như tờ giấy bồi nhưng dai mềm dẻo mịn lạ kỳ, được làm từ bột gạo tẻ dẻo thơm thượng hạng. Nhân bánh cuốn gồm thịt nạc vai băm nhỏ xào với mộc nhĩ dòn thơm. Điểm đặc sắc là hành khô phi vàng giòn rượm rải bên trên, chấm cùng nước mắm cốt pha chua ngọt, vắt thêm lát quất thơm lừng, có thể dùng kèm chả nướng than.',
    whereToEat: ['Bánh cuốn Bà Lành (252 Tống Duy Tân, TP. Thanh Hóa)', 'Bánh cuốn Nguyễn Chích (TP. Thanh Hóa)', 'Bánh cuốn Nguyễn Du (TP. Thanh Hóa)'],
    bestTime: 'Ăn sáng hoặc ăn tối nhẹ nhàng',
    tags: ['Mỏng mướt dẻo dai', 'Hành phi giòn thơm', 'Chuẩn vị truyền thống']
  },
  {
    id: 'vit-co-lung',
    name: 'Vịt Cổ Lũng Pù Luông',
    image: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&w=600&h=400&q=80',
    description: 'Giống vịt đặc sản quý hiếm được nuôi thả tự nhiên tại vùng lõi rừng bảo tồn Pù Luông, Bá Thước. Nhờ uống nước suối ngàn tinh khiết và ăn hạt ngô rừng, vịt Cổ Lũng nổi tiếng với xương nhỏ, thịt săn chắc, béo ngọt tự nhiên mà không ngấy. Vịt ngon nhất khi được nhồi lá móc mật, gia vị rừng rồi nướng trên than hồng cho da vàng ruộm óng ánh.',
    whereToEat: ['Các homestay tại Bản Đôn, Bản Kho Mường (Pù Luông, Bá Thước)', 'Nhà hàng đặc sản Pù Luông (Bá Thước)'],
    bestTime: 'Bữa trưa hoặc bữa tối khi du lịch Pù Luông',
    tags: ['Đặc sản núi rừng', 'Thịt thơm săn chắc', 'Nướng móc mật thơm lừng']
  },
  {
    id: 'banh-rang-bua',
    name: 'Bánh Răng Bừa (Bánh Tẻ)',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&h=400&q=80',
    description: 'Có tên gọi độc đáo giống chiếc răng bừa làm nông nghiệp truyền thống, đây là món bánh dâng vua thuở xưa trong các dịp lễ tết xứ Thanh. Bánh được làm từ bột gạo tẻ xay mịn, nhân mộc nhĩ xào cùng thịt ba chỉ béo ngậy và hành củ thơm phức, gói chặt trong lá dong xanh mướt rồi luộc chín tới. Ăn lúc bánh còn bốc khói nghi ngút để cảm nhận vị dẻo mềm dẻo mịn tan đầu lưỡi.',
    whereToEat: ['Cửa hàng đặc sản Chợ Tây Thành (TP. Thanh Hóa)', 'Làng nghề bánh răng bừa Trung Lập (Thọ Xuân, Thanh Hóa)'],
    bestTime: 'Thưởng thức nóng hổi vào buổi sáng',
    tags: ['Dâng tiến vua chúa', 'Nóng hổi dẻo thơm', 'Đậm vị đồng quê']
  },
  {
    id: 'che-lam',
    name: 'Chè Lam Phủ Quảng',
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=600&h=400&q=80',
    description: 'Món bánh ngọt cổ truyền có từ hàng trăm năm trước tại vùng đất Phủ Quảng (Vĩnh Lộc). Bánh được nấu từ mật mía cô đặc thơm ngọt cát mịn, gạo nếp nương rang phồng giã nhỏ, gừng tươi giã nhuyễn thơm nồng ấm áp, và lạc rang béo bùi giòn rụm. Thưởng thức miếng chè lam dẻo thơm, nhấp ngụm chè xanh nóng ấm chát nhẹ giữa buổi chiều tà là trải nghiệm thanh tao tuyệt mỹ.',
    whereToEat: ['Khu di tích Thành Nhà Hồ (Vĩnh Lộc, Thanh Hóa)', 'Các cơ sở sản xuất truyền thống tại thị trấn Vĩnh Lộc'],
    bestTime: 'Thích hợp tráng miệng kèm trà xanh',
    tags: ['Ngọt ngào ấm nồng', 'Mật mía & gừng tươi', 'Quà tặng di sản']
  }
];
